import { DefaultEventSource } from "./DefaultEventSource.js";
import { EventType, Event } from "../models/Event.js";
import * as cheerio from "cheerio";

class JapancheapoEventSource extends DefaultEventSource {

    id = "meetup";

    
    public getId(): string {
      return this.id
    };

    async searchEvent(query: string): Promise<Array<EventType>> {
      let events = new Array();
      
      const res = await fetch("https://japancheapo.com/events/");
      const html = await res.text();
      
      const $ = cheerio.load(""+html);
      
      $(".article").each((index, element) => {
        
        // Extract and log the text content of each element
        let val = $(element).find(".card__cta").find("a").attr("href") || "";
        let anEvent = new Event(val);

        val = $(element).find(".card__content").find(".card__title").text() || "";
        anEvent.name = val.trim();

        val = $(element).find(".card__content").find(".card__excerpt").text() || "";
        anEvent.description = val.trim();

        // SCHEDULE
        let day = $(element).find("div .day").text() || "";
        let date = $(element).find("div .date").text() || "";
        // console.log(`VAL: [${day} - ${date}]`);        

        // SCHEDULE v2
        val = $(element).find('[title*="end time"]').next().text() || "";
        // console.log($(element).find('.card--event__attribute').next().getAttrList);
        anEvent.name = val.trim();
        // console.log(`VAL: [${val}]`);

        // FEE
        val = $(element).find('[title*="Entry"]').parent().text() || "";
        // console.log($(element).find('.card--event__attribute').next().getAttrList);
        anEvent.name = val.trim();
        // console.log(`FEE: [${val.trim()}]`);

        // CATEGORY
        val = $(element).find('[title*="Category"]').parent().text() || "";
        anEvent.name = val.trim();
        // console.log(`CATEGORY: [${val.trim()}]`);

        // LOCATION
        val = $(element).find('.card__category').text() || "";
        anEvent.name = val.trim();
        console.log(`LOCATION: [${val.trim()}]`);
        // val = $(element).find('[title*="end time"]').next().text() || "";
        // // console.log($(element).find('.card--event__attribute').next().getAttrList);
        // anEvent.name = val.trim();
        // console.log(`VAL: [${val}]`);

        // events.push(anEvent);
        // console.log(val);
      });
      
      // console.log(events);
      return new Promise((resolve, reject) => resolve(events));
    }

  }

export { JapancheapoEventSource }