import { DefaultEventSource } from "./DefaultEventSource.js";
import { EventType, Event, EventCategoryEnum } from "../models/Event.js";
import * as cheerio from "cheerio";
import moment, { Moment } from 'moment';
import { log } from "../utils/logger.js";
moment().format();

class JapancheapoEventSource extends DefaultEventSource {

    id = "japancheapo";
    CURRENCY = 'YEN';
    
    public getId(): string {
      return this.id
    };

    async searchEvent(query): Promise<Array<EventType>> {
      let events = [];
      // console.log("QUERY !!");
      return new Promise((resolve, reject) => resolve(events));
    }
    
    async scrapEvent(): Promise<Array<EventType>> {
      let events = new Array();

      log.info(`${this.id}: scrapping started`);

      // FIXME: get back to 18
      for (let i = 1; i<18; i++) {
        log.info(`${this.id}: scrapping ongoing. page ${i}`);

        const res = await fetch(`https://japancheapo.com/events/page/${i}/`);
        const html = await res.text();

        const $ = cheerio.load(html);
        
        $(".article.card--event").each((index, element) => {

          let val = $(element).find('.card__cta').find('a').attr('href') || "";
          let anEvent = new Event(val);

          val = $(element).find(".cheapo-archive-thumb").attr("alt") || "";
          anEvent.teaserText = val.trim();
          
          // TO DEBUG
          // let _val = $(element).find(".cheapo-archive-thumb").toString() || "";
          val = $(element).find(".cheapo-archive-thumb").attr("src") || "";

          anEvent.teaserMedia = val.trim();

          val = $(element).find(".card__content").find(".card__title").text() || "";
          anEvent.name = val.trim();

          val = $(element).find(".card__content").find(".card__excerpt").text() || "";
          anEvent.description = val.trim();

          // SCHEDULE date
          // - keep only numbers, month name. everything else = blank
          // - remove duplicates space
          // - split by space
          // - if only a month name: assume full month
          // - if more than 2 elements: assume a two days+ event
          val = $(element).find(".card--event__date-box").text() || "";          
          let monthList: string [] = ['jan', 'feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
          let dates: string[] = val
            .toLowerCase()
            .replace(/\\n/g, ' ')
            .replace(/\s\s+/g, ' ')
            .split(' ').filter(
              (value) => {
                if (monthList.indexOf(value.trim()) >= 0) return true;
                if (isNaN(parseInt(value, 10))) return false;
                return true;
              }
            )

          // try to guess the year. only futur event are displayed on the website.
          // ! 0 based
          let currentMonth = moment().month();
          let eventYear = moment().year();
          let begin: Moment = moment();
          let end: Moment = moment();

          if (dates.length === 1 && monthList.indexOf(dates[0]) >= 0) {
            // full month event

            let eventMonthIndex = monthList.indexOf(dates[0])
            if (eventMonthIndex < currentMonth) {
              eventYear++;
            }

            begin = moment([eventYear, eventMonthIndex]);
            end = moment(begin).endOf('month');

          } else if (dates.length === 2 
            && monthList.indexOf(dates[0]) >= 0
            && monthList.indexOf(dates[1]) >= 0) {
            // 2 months long (ex: nov - dec)  
            begin = moment([eventYear, monthList.indexOf(dates[0])]);
            end = moment([eventYear, monthList.indexOf(dates[1])]).endOf('month');

          } else if (dates.length === 2) {
            // one day event
            // make sure, day number is first, then month name
            dates.sort();
            let eventDay = dates[0];
            let eventMonth = dates[1];
            let eventMonthIndex = monthList.indexOf(eventMonth);
            if (eventMonthIndex < currentMonth) {
              eventYear++;
            }

            begin = moment([eventYear, eventMonthIndex, eventDay]);
            end = moment(begin).endOf('day');
            
          } else if (dates.length === 4) {
            // event span more than 1 day.
            // FIXME: begin/end assumed to be on the same year ...
            let datesBegin = [dates[0], dates[1]].sort();
            let datesEnd = [dates[2], dates[3]].sort();

            let eventBeginDay = datesBegin[0];
            let eventBeginMonth = datesBegin[1];
            let eventBeginMonthIndex = monthList.indexOf(eventBeginMonth);
            if (eventBeginMonthIndex < currentMonth) {
              eventYear++;
            }

            let eventEndDay = datesEnd[0];
            let eventEndMonth = datesEnd[1];
            let eventEndMonthIndex = monthList.indexOf(eventEndMonth);

            begin = moment([eventYear, eventBeginMonthIndex, eventBeginDay]);
            end = moment([eventYear, eventEndMonthIndex, eventEndDay]).endOf('day');

          }
          
          // SCHEDULE time
          val = $(element).find('[title*="end time"]').next().text().toLocaleLowerCase() || "";
          anEvent.datetimeFreeform = val.trim();
          if (val.length > 0) {
            // format is like "9:00am – 5:00pm"
            let cmp = val.split(' ');
            let beginCmp: string, endCmp: string;
            if (cmp.length === 1) {
              // only start time.
              beginCmp = val.trim();
              endCmp = beginCmp;
            } else {
              beginCmp = cmp[0].trim();
              endCmp = cmp[2].trim();
            }
            let startTime = moment(beginCmp, "h:ma");
            let endTime = moment(endCmp, "h:ma");

            begin.hour(startTime.hour());
            begin.minute(startTime.minute());
            end.hour(endTime.hour());
            end.minute(endTime.minute());
          }

          // SCHEDULE time and date are saved in combo
          anEvent.datetimeFrom = begin.toDate();
          anEvent.datetimeTo = end.toDate();
          
          // FEE
          val = $(element).find('[title*="Entry"]').parent().text() || "";
          anEvent.budgetFreeform = val.trim();
          if (val.trim().toLowerCase() === "free" || val.trim().length === 0) {
            anEvent.budgetMin = 0
            anEvent.budgetMax = 0
          } else {
            // format is like "¥400 – ¥1,000" or "¥500 (at the door)"
            // keep only ¥XXXX
            let prices: number[] = [];
            for (let cmp of anEvent.budgetFreeform.split(' ')) {
              let cmp2 = cmp.replace(/\D/g,'');
              if (cmp2.length > 0) {
                prices.push(Number(cmp2))
              }
            }
            prices.sort( (a, b) => { return a-b });
            if (prices.length === 1) {
              anEvent.budgetMin = anEvent.budgetMax = prices[0];
            } else {
              anEvent.budgetMin = prices[0];
              anEvent.budgetMax = prices[prices.length-1];
            }
          }
          anEvent.budgetCurrency = this.CURRENCY;

          // CATEGORY
          val = $(element).find('[title*="Category"]').parent().text() || "";
          for (let c in EventCategoryEnum) {
            let normalizedCategoryName = EventCategoryEnum[c];
            for (let word of val.toLocaleLowerCase().trim().split(' ')) {
              if (normalizedCategoryName.toLowerCase().indexOf(word) >= 0) {
                anEvent.category = EventCategoryEnum[c];
                break;
              }
            }
          }
          anEvent.categoryFreeform = val.trim();

          // LOCATION
          val = $(element).find('.card__category').text() || "";
          anEvent.placeFreeform = val.trim();

          events.push(anEvent);
        });

      }
      log.info(`${this.id}: scrapping done. ${events.length} found.`);

      return new Promise((resolve, reject) => resolve(events));
    }
  }

export { JapancheapoEventSource }