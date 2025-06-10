## configuration

for now, configuration is static, and in ```util/config.js```.
there, you will find the list of possible datasource, you can enable/disable them with the named attribute (true/false)

### homeCountry

this is used to add ", {country}" before asking for geocoding. OSM works best if you narrow down the search.
- if the source website cover multiple countries: use "" (blank value) (it's also the default value)
- if not, just add whatever works best for the given country (should be country name in english. ex: japan). (it will be converted to lowercase).

## REST endpoint

### Initialisation / warmup of cache

first thing to do after application startup, is to populate the cache.
this call must be done for each sourceid (as seen in config.ts) or their content
won't be inside the query result.

launch a resync from the given source id (ex: japanscheapo)

```GET /api/internal/scrap/${sourceid}```

### Usage

when the cache has been loaded, you can make query against the content.
it will return an unfiltered, merged, list of all event from all enabled source.

```GET /api/events```

also, you can add a query (as for now, only the description field is checked against)

```GET /api/events?query=firework```

### Location basedsearch

All event will be sent to UI with the "placeDistance" field set with the number of kilometers from:
- the browser location if the UI has set the *browserLat* & *browserLong* query field
- O in all other cases (including the one where we are unable to compute the
distance since the placeFreeform didn't resolve to something in OSM)

on top of that, the resultset of events will be filtered *before* sent to the UI 
and only those where the distance is lower than "placeDistanceRange" will be kept.
As before, if either the browser location OR the event place is not set,
the resulting distance will be O and the event will NOT be filtered out.

To get all fireworks in a 100km radius, with the browser location as xx.xxx/yy.yyy, use:

```GET /api/events?query=firework&placeDistanceRange=100000&browserLat=xx.xxx&browserLong=yy.yyy```

## logging

colorized winston is setup, default send to console 
`import { log } from ./utils/logger` then `log.info(...)`

## users and timeline endpoints

### friendship creation
Send a POST request to ```/events/friend``` with the following body:

{
  "user_uid": "user-a",
  "friend_uid": "user-b"
}

### create a timeline entry (=add favorite)
Send a POST request to ```/events/timeline``` with the following body:

{
  "user_uid": "user-a",
  "event_id": "uuid"
}

### get user timeline
send a GET with the userid to ```/events/timeline?user_id={userUid}```

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
