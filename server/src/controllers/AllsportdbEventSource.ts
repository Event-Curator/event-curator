/**
 * this API come with serious limitations:
 * - max 10 records by page (you have to figure out yourself when the "end is reacned")
 * - 30 day max for api key (can be regenerared easily)
 * - not all data field (but many are already there)
 * - 10k request / month
 * - no search by keywords. only by categories/place
 * 
 * to fix those, we are scrapping as if this was a public website.
 * with this, come the "local search" against RxDB
 */
import { EventCategoryEnum, EventType, Event } from '../models/Event.js';
import config from '../utils/config.js';
import { log } from '../utils/logger.js';
import { DefaultEventSource } from './DefaultEventSource.js';
import * as ec from "./eventController.js";

class AllsportdbEventSource extends DefaultEventSource {

    id = "allsportdb";
    CURRENCY = '???';
    
    public getId(): string {
      return this.id
    };

    async scrapEvent(): Promise<Array<EventType>> {
      let events = new Array();
      let [myConfig] = config.sources.filter( c => c.id === this.id );
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set("Authorization", `Bearer ${process.env.API_ALLSPORTDB_KEY }`);
      requestHeaders.set("accept", "application/json");

      log.info(`${this.id}: scrapping started`);

      for (let week = 0; week<4
        ; week++) {
        let page = 1;
        do {
          log.info(`${this.id}: scrapping ongoing. week ${week}, page ${page}`);

          const res = await fetch(`${myConfig.endpoint}/calendar?week=${week}&page=${page}`, {
            method: "GET",
            headers: requestHeaders
          });
          const result = await res.json();

          // no more data for this week
          if (result.length === 0) break;

          for (let event of result) {
            let anEvent = new Event(event.url);
            anEvent.name = event.competition;
            anEvent.description = event.name;
            anEvent.teaserText = event.sport;

            anEvent.teaserMedia = event.webUrl;
            let localUrl = await ec.saveMedia(anEvent.teaserMedia);
            if (localUrl) { anEvent.teaserMedia = localUrl };

            anEvent.budgetCurrency = this.CURRENCY;
            anEvent.budgetMin = 0;
            anEvent.budgetMax = 0;
            anEvent.budgetFreeform = "";

            anEvent.datetimeFreeform = event.date;
            anEvent.datetimeFrom = new Date(event.dateFrom);
            anEvent.datetimeTo = new Date(event.dateTo);

            anEvent.category = EventCategoryEnum.SPORT;
            anEvent.categoryFreeform = event.sport;

            // some events span multiple country and/or cities
            // we get the country only if there is only one, same for city
            if (event.location.length === 1) {
              let country = event.location[0].name.toLowerCase();

              if (event.location[0].locations.length === 1) {
                let city = event.location[0].locations[0].name.toLowerCase();
                anEvent.placeFreeform = `${city}, ${country}`;

              } else {
                anEvent.placeFreeform = country
              }
            }

            // FIXME
            // wikiUrl
            // twitterUrl
            // facebookUrl

            events.push(anEvent);
          }
          page++;
        } while (true);
      };

      log.info(`${this.id}: scrapping done. ${events.length} found.`);

      return new Promise((resolve, reject) => resolve(events));
    }
  }

export { AllsportdbEventSource }