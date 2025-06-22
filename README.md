# Japan Events

**Japan Events** is a fullstack web app for finding events in Japan. It works by by indexing
numerous data sources from around the web and presenting the user with a simple and
intuitive UI for finding said events. End users can search for events by keyword, date(s),
category, budget, location (by prefecture or by proximity in km), or any combination of the
above.

You can try it here: [eventsjp.com](https://eventsjp.com "Japan Events").

---

## Tech stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- daisyUI

### Backend

- Node.js
- Express.js
- PostgreSQL
- Knex.js
- RxDB

### Authentication

- Firebase

---

## Installation

### Environment Variables

First, you'll need to prepare the following environment varibles.

#### Frontend (`/client`)

- `VITE_API` (this app's server endpoint)

#### Backend (`/server`)

- `PORT` (the Express server port)
- `NODE_ENV` (configures the deployment environment. We recommend `render` if deploying on Render).
- `MEDIA_STORAGE_PATH` for persistent storage on deployment. We recommend `/media`.
- `DB_URL`. The database connection string.
- `API_ALLSPORTDB_KEY`. The API key for connecting to All Sports Database.
- You'll also need to configure your Google Application Credentials. If deploying on Render,
  we recommend keeping this information in a `serviceAccountKey.json` file in the root of the instance.

### Installation Proper

You'll need at least `node.js` version 10.9.0 to run this app.

```bash
cd ./server
npm run build
npm run migrate
npm start
```

---

## Usage (Frontend)

In addition to the search functions mentioned above, users can login with either a Google
account or with email and password. Authenticated users can save events they're interested
in and access these events in "My Timeline" page. The timeline displays saved events in two
different view modes:

1. _Table View_. Saved events display top-to-bottom in chronological order. Users can
   unpin events.
2. _Week View_. Saved events are displayed in a weekly calendar. Events that take place on
   more than one day are displayed as bars on the top of the view that span more than one day.
   Users can select which days of multi-day events they plan on attending.

Additionally, clicking the Share button provides as link to an anonymized timeline, which
users can share with anyone, including users who are not registered or logged in.
