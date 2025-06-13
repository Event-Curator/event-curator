import { DefaultEventSource } from "./DefaultEventSource.js";
import { EventType, Event, EventCategoryEnum } from "../models/Event.js";
import * as cheerio from "cheerio";
import moment, { Moment } from 'moment';
import { log } from "../utils/logger.js";
import * as utils from "../utils/util.js"
import * as ec from "./eventController.js";

moment().format();

class ArisugawaParkEventSource extends DefaultEventSource {

    id = "arisugawapark";
    CURRENCY = 'YEN';
    
    public getId(): string {
      return this.id
    };

    async getEventDetail(url: string): Promise<Event> {
      const html = await ec.throtthledFetch(url, 0);
      const $ = cheerio.load(html);

      let event = new Event(url);

      let topContainer = $.root().find("section .content");
      let bottomContainer = $.root().find("article");

      // we are probably not on the correct page, safer to just return noting
      if (!topContainer || !bottomContainer) {
        return event
      }

      event.name = $(topContainer).find('h3').text().trim();
      event.description = $(bottomContainer).text().trim();

      // here, the place is actually category tag like a breadcrumb. we just take the last one
      // event.placeFreeform = $.root().find('.breadcrumbs').find('span:last').text().trim();
      event.placeFreeform = $.root().find('.park_cat').text().trim();

      // for the teaser media, we just take the first image we found inside the article
      event.teaserMedia = $(bottomContainer).find('img').attr('src') || "";
      event.teaserText = $(bottomContainer).find('img').attr('alt') || "";

      return event;
    }

    async scrapEvent(): Promise<Array<EventType>> {
      let events = new Array();
      let myConfig = utils.getConfig(this.id);

      log.info(`${this.id}: scrapping started`);

      for (let park of ['shiba','azabu']) {
        let currentPage = 1;
        while (1) {
          log.info(`${this.id}: scrapping ongoing. park: ${park} > page: ${currentPage}`);
          
          // get the list of events in the currentPage
          const html = await ec.throtthledFetch(`${myConfig.endpoint}/${park}/topics/page/${currentPage}/?topic=event`, 0);
          const $ = cheerio.load(html);
          
          const pageItems = $.root().find('section #topics_list').find('li') || [];
          
          if (pageItems.length === 0) {
            log.debug("last page reached. exiting");
            break;
          }
          for (let item of pageItems) {
            let originUrl = $(item).find('a').attr('href') || "";
            
            let anEvent = new Event(originUrl);
            anEvent.originUrl = originUrl;

            // site specific stuff.
            // if "Registration closed" appear, we just pass this event.
            // website change the description this way to "close the event"
            // we keep the original name taken when the event was open (same url)
            // FIXME: we should add this event anyway with a flag telling to not update the name
            
            // date parsing block
            anEvent.datetimeFreeform = $(item).find('time').text().trim() || "";
            let cleanDate = $(item).find('time').text().trim().replace(/\D/g,'');
            
            if (cleanDate.length > 0) { 
              anEvent.datetimeFrom = moment(cleanDate, 'YYYYMMDD').toDate();
              anEvent.datetimeTo = anEvent.datetimeFrom;
            }
            
            let eventDetail = await this.getEventDetail(anEvent.originUrl);
            anEvent.name = eventDetail.name;
            anEvent.description = eventDetail.description;
            anEvent.budgetCurrency = this.CURRENCY;
            anEvent.placeFreeform = eventDetail.placeFreeform;

            anEvent.teaserMedia = eventDetail.teaserMedia;
            anEvent.teaserText = eventDetail.teaserText;

            anEvent.category = EventCategoryEnum.FAMILY;

            events.push(anEvent);
          }
          
          currentPage++;
        }
      }

      log.info(`${this.id}: scrapping done. ${events.length} found.`);

      return new Promise((resolve, reject) => resolve(events));
    }
  }

export { ArisugawaParkEventSource }