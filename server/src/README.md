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

## backup/restore

all configs are available inside utils/config.js
there is two new values:

backup type = file (for local dev)
```
const config: Config = {
    backupSchedule: "0 22 * * *",
    backupTarget: "file:../backups"
}
```

backup type = sql (for local dev OR production)
```
const config: Config = {
    backupSchedule: "0 22 * * *",
    backupTarget: "sql:backups"
}
```

### backup

RxDB events collection, wich contains the events metadata, can be exported inside the ${projectDir}/backups folder by calling

```PUT /api/cache/backup/events```

the backup is also run each day at 23 PM

in all case, the backup file ends up in ${projectdir}/backups with a filename containing the current time.

note: all details are sent to node console.

### restore

a manual restore of this collection can be done by calling

```PUT /api/cache/restore/events```

also, at node startup, the newest backup is took and reloaded inside the engine automatically.

note: all details are sent to node console.


## meta information

there is one endpoint to get the content distribution with different focus.
like how many hits there is in the dataset for a given city, or category

the endpoint is ```/api/meta?key=${searchTerm}```

search term can be "category", or "placeFreeform", or any other field that is available in the search endpoint.

the response will looks like
```
[
    {
        "name": "Sports & Fitness",
        "count": 174,
        "label": "Sports & Fitness (174)"
    },
    {
        "name": "Other",
        "count": 331,
        "label": "Other (331)"
    },
    {
        "name": "Performing & Visual Arts",
        "count": 9,
        "label": "Performing & Visual Arts (9)"
    },
    {
        "name": "Food & Drink",
        "count": 13,
        "label": "Food & Drink (13)"
    },
    {
        "name": "Music",
        "count": 13,
        "label": "Music (13)"
    },
    {
        "name": "Film, Media & Entertainment",
        "count": 3,
        "label": "Film, Media & Entertainment (3)"
    }
]
```

## Scraping a new website.

### prepare the source files:

note: in all case, please respect the naming convention of the different object type, which are:
- ```websiteid``` = take the domainname, all lowercase and ascii letter
- ```controller name```=  websiteid but in camelCase
 
As a preliminary step, thinks to consider are:
- clone the ```server/src/controllers/_templateEventSource.ts``` file
