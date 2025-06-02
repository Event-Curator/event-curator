## configuration

for now, configuration is static, and in ```util/config.js```.
there, you will find the list of possible datasource, you can enable/disable them with the named attribute (true/false)

## REST endpoint

```GET /api/events```

will return an unfiltered, merged, list of all event from all enabled source.

```GET /api/events?query=firework```

will return an filtered, merged, list of all event from all enabled source.

```GET /api/internal/scrap/${sourceid}```

launch a resync from the given source id (ex: japanscheapo)

## logging

colorized winston is setup, default send to console 
`import { log } from ./utils/logger` then `log.info(...)`

## Databroker

every datasource must implements ```IEventSource``` interface and extends the ```DefaultEventsource```
As for now, there is only to exposed methods:


## Scraping

Doc: https://cheerio.js.org/docs/api
https://webscrapingsite.com/blog/mastering-attribute-selectors-in-cheerio-the-ultimate-guide/
https://proxiesapi.com/articles/the-ultimate-cheerio-web-scraping-cheat-sheet
https://cheerio.js.org/docs/basics/selecting?ref=pixeljets.com
https://zetcode.com/javascript/cheerio/

    "name": selector("h3").first().text(),    
    "price": selector(".price>span").text(),    
    "priceFull": selector(".product-price-full").text(),    
    "description": selector(".product-description").text(),  