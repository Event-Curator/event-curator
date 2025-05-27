# utils

## REST endpoint

```GET /api/events```

will return an unfiltered, merged, list of all event from all enabled source.
(currently, there is only test data here)

## logging

colorized winston is setup, default send to console 
`import { log } from ./utils/logger` then `log.info(...)`
