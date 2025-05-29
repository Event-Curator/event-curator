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

      for (let i = 1; i<5; i++) {
        console.log("page: ", i);
        const res = await fetch(`https://japancheapo.com/events/pages/${i}/`);
        const html = await res.text();
        
        const $ = cheerio.load(""+html);
        
        $(".article").each((index, element) => {
          
          // Extract and log the text content of each element
          let val = $(element).find(".card__cta").find("a").attr("href") || "";
          let anEvent = new Event(val);

          val = $(element).find(".card__image").find("img").attr("alt") || "";
          anEvent.teaserText = val.trim();

          val = $(element).find(".card__image").find("img").attr("src") || "";
          // val = $(element).find(".cheapo-archive-thumb").attr("src") || "";
          console.log("MEDIA: ", val);
          anEvent.teaserMedia = val.trim();

          val = $(element).find(".card__content").find(".card__title").text() || "";
          anEvent.name = val.trim();

          val = $(element).find(".card__content").find(".card__excerpt").text() || "";
          anEvent.description = val.trim();

          // SCHEDULE
          // let day = $(element).find("div .day").text() || "";
          // let date = $(element).find("div .date").text() || "";
          val = $(element).find('[title*="end time"]').next().text() || "";
          anEvent.datetimeFreeform = val.trim();

          // FEE
          val = $(element).find('[title*="Entry"]').parent().text() || "";
          anEvent.budgetFreeform = val.trim();

          // CATEGORY
          val = $(element).find('[title*="Category"]').parent().text() || "";
          anEvent.categoryFreeform = val.trim();

          // LOCATION
          val = $(element).find('.card__category').text() || "";
          anEvent.placeFreeform = val.trim();

          events.push(anEvent);
        });
      }

      return new Promise((resolve, reject) => resolve(events));
    }

  }

export { JapancheapoEventSource }