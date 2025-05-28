import { DefaultEventSource } from "./DefaultEventSource.js";
import * as pe from "../models/Event.js";
import axios from "axios";
import * as cheerio from "cheerio";

class JapancheapoEventSource extends DefaultEventSource {

    id = "japancheapo";

    public getId(): string {
        return this.id
    };

  async searchEvent(query: string): Promise<Array<pe.EventType>> {
    let events = new Array();

    // console.log(cheerio);
    
    let response = await axios.get("https://japancheapo.com/events");
    
    // FIXME: weird ...
    const cher = cheerio["default"].load(response.data);
    
    cher(".cheapo-preview").each( (index, article) => {
      let title = cher(article).text();
      // console.log(Object.keys(title));
      console.log(title);
    })
    // "price": selector(".price>span").text(),    
    // "priceFull": selector(".product-price-full").text(),    
    // "description": selector(".product-description").text(),    
  
    // events.push("CHEAPO event test 1")
    // events.push("CHEAPO event test 2")

    return new Promise((resolve, reject) => resolve(events))
  }
}

export { JapancheapoEventSource }