import { DefaultEventSource } from "./DefaultEventSource.js";
import { EventType, Event, EventCategoryEnum } from "../models/Event.js";
import * as cheerio from "cheerio";
import moment, { Moment } from 'moment';
import { log } from "../utils/logger.js";
import * as utils from "../utils/util.js"
import * as ec from "./eventController.js";
import { timeEnd } from "console";

moment().format();

class JpeventfeedEventSource extends DefaultEventSource {

    id = "jpeventfeed";
    CURRENCY = 'YEN';

    public getId(): string {
      return this.id
    };

    safeGetAttr(o: any, name: string) {
      if (!o.rawAttributes) return '';
      let r = o.rawAttributes.filter( a => a.name.toLocaleLowerCase() === name.toLocaleLowerCase() )

      if (!r || r.length === 0) return '';
      return r[0].value
    }

    async scrapEvent(): Promise<Array<EventType>> {
      let events = new Array();
      let myConfig = utils.getConfig(this.id);
      let apiKey = process.env.API_JPEVENTFEED_KEY || '';

      log.info(`${this.id}: scrapping started`);

      let currentPage = 1;
      while (1) {
        log.info(`${this.id}: scrapping ongoing. page: ${currentPage}`);

        // get the list of events in the currentPage
        let targetUrl = `${myConfig.endpoint}?apiKey=${apiKey}&page=${currentPage}`;

        const res = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'user-agent': '4tor10b: nTIfoT8tLzkun2HhVTuiqlOupzHtrJ91VUEiMTS5VQ8X ???'
          }
        });

        const response = await res.json();

        if (response.hasMore === false) {
          log.debug("last page reached. exiting");
          break;
        }

        for (let upstreamEvent of response.events) {

          let event = new Event(upstreamEvent.fingerprint);


          // general stuff
          event.originUrl = upstreamEvent.eventInfoUrl || "";
          event.name = upstreamEvent.eventName || "";

          let _r: string[] = [];
          if (upstreamEvent.rawAttributes) {
            let _val = Object.values(upstreamEvent.rawAttributes).forEach( (v: any) => {
              if (v) _r.push(`${v.name}: ${v.value}`)
            })
          }

          if (upstreamEvent.inquiries) {
            _r.push(upstreamEvent.inquiries);
          }
          event.description = _r.join('\n');


          // location stuff
          event.placeLattitude = upstreamEvent.latitude;
          event.placeLongitude = upstreamEvent.longitude;

          _r = [];
          if (this.safeGetAttr(upstreamEvent, "Place")) _r.push(this.safeGetAttr(upstreamEvent, "Place"));
          if (upstreamEvent.venue) _r.push(upstreamEvent.venue)
          _r.push(upstreamEvent.address.address);
          _r.push(upstreamEvent.address.city);
          _r.push(upstreamEvent.address.postalCode);
          _r.push(upstreamEvent.ward);
          _r.push(upstreamEvent.prefecture);
          event.placeFreeform = _r.join(' ');

          // timings
          let _startDay = moment(upstreamEvent.dateStart, 'YYYY/M/DT');
          let _endDay = moment(upstreamEvent.dateEnd, 'YYYY/M/D');
          _startDay.startOf('day');
          _endDay.endOf('day');

          if (upstreamEvent.timeStart) {
            _startDay.add(Number(upstreamEvent.timeStart.split(':')[0]), 'hours')
            _startDay.add(Number(upstreamEvent.timeStart.split(':')[1]), 'minutes')
          }

          if (upstreamEvent.timeEnd) {
            _endDay.add(Number(upstreamEvent.timeEnd.split(':')[0]), 'hours')
            _endDay.add(Number(upstreamEvent.timeEnd.split(':')[1]), 'minutes')
          }

          event.datetimeFrom = _startDay.toDate();
          event.datetimeTo = _endDay.toDate();

          _r = [];
          if (this.safeGetAttr(upstreamEvent, "Date")) _r.push(this.safeGetAttr(upstreamEvent, "Date"));
          if (this.safeGetAttr(upstreamEvent, "TimeFreeform")) _r.push(this.safeGetAttr(upstreamEvent, "TimeFreeform"));
          event.datetimeFreeform = _r.join(', ');


          // budget stuff
          event.budgetFreeform = this.safeGetAttr(upstreamEvent, "Price");
          if (upstreamEvent.price) {
            let _val = Number(upstreamEvent.price);
            if (!isNaN(_val)) {
              event.budgetMin = _val;
              event.budgetMax = event.budgetMin;
            }
          }

          event.budgetCurrency = this.CURRENCY;

          if (upstreamEvent.thumbnailImage) event.teaserMedia = upstreamEvent.thumbnailImage;
          if (event.teaserMedia && event.teaserMedia.length > 0) {
            let localUrl = await ec.saveMedia(event.teaserMedia);
            if (localUrl) { event.teaserMedia = localUrl };
            event.teaserText = upstreamEvent.venue;
          }

          if (upstreamEvent.category === "SPORTS") upstreamEvent.category = "SPORT";
          if (upstreamEvent.category === "LIFESTYLE") upstreamEvent.category = "HOME";
          if (upstreamEvent.category && 
            Object.keys(EventCategoryEnum).includes(upstreamEvent.category) ) {
            event.category = EventCategoryEnum[upstreamEvent.category]

          } else {
            event.category = EventCategoryEnum.OTHER;
          }

          if (upstreamEvent.address) {
            log.warn("saving address from upstream. begin");
            event.placeCity = upstreamEvent.city;
            event.placeSuburb = upstreamEvent.ward;
            event.placeProvince = upstreamEvent.prefecture;
            event.placeCountry = 'Japan';
            log.warn("saving address from upstream. end");
          }

          events.push(event);
        }
        
        currentPage++;
      }
      
      for (let e of events) {
        if (e.externalId === '02b02977fac8b57adc9e5f0aa8136b5d') {
          log.error('FOUND IT: ');
          log.error(e.name);
        }
      }

      log.info(`${this.id}: scrapping done. ${events.length} found.`);

      return new Promise((resolve, reject) => resolve(events));
    }
  }

export { JpeventfeedEventSource }