## Databroker

every datasource must implements ```IEventSource``` interface and extends the ```DefaultEventsource```
As for now, there is only to exposed methods:

- search(querystring) => return an Array of ```EventType``` events (can be empty) matching the query string
  as for now, the querystring is ignored, because of a lack of data. 
  - All enabled datasource results are merged before sending the results in the endpoints

- id    => should return the key in the ```config.js``` file

## configuration

for now, configuration is static, and in ```util/config.js```.
there, you will find the list of possible datasource, you can enable/disable them with the named attribute (true/false)

## REST endpoint

```GET /api/events```

will return an unfiltered, merged, list of all event from all enabled source.
(currently, there is only test data here)

## logging

colorized winston is setup, default send to console 
`import { log } from ./utils/logger` then `log.info(...)`


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