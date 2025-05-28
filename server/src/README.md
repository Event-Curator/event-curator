# EventCurator

Discover, organize, and share the best events in Japan! Festivals, Art, Concerts, Sports, Anime Events & More!

---

## 🚀 Introduction

**EventCurator** is a web app built to make it easy for anyone—locals, students, travelers—to discover upcoming events in Japan, create personal event calendars, and share recommendations with others. The app is designed for a smooth experience in English, Japanese, French, etc, so you never miss out on great events, even if you don’t speak the language.

---

## 🌟 MVP Features (Done!)

- **Modern, Responsive UI:** Built with Next.js, Tailwind CSS, and DaisyUI for a polished, mobile-friendly look.

- **Navigation Bar:**
  - Left: Dropdown menu (Events, Categories, Contact)
  - Center: Logo and app title
  - Right: Authentication section (email/password, Google sign-in), fully functional and responsive

- **Hero Section:** Attractive background image and welcoming headline
- **Events Section:** Placeholder container for future event data
- **Footer:** Modern footbar with branding
- **Firebase Authentication:** Sign up/sign in with email/password or Google; UI instantly  reflects user state

- **Error Handling & Feedback:** Alerts for loading, errors, and user actions
- **Responsive Design:** Works seamlessly on mobile and desktop

---

## 🛠️ Tech Stack

- [Next.js] (https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- [Firebase Authentication] (https://firebase.google.com/docs/auth)
- [Node.js/Express] + (Firebase Admin SDK for protected endpoints)

---

## 🎯 What’s Next (Planned Features)

- **Event Data Integration:** Fetch and display real events from APIs (Eventbrite, Meetup, Peatix, Tokyo Cheapo, etc.)
- **User Event Timelines:** Let users build custom event calendars/timelines, with filters for type, date, and location
- **Event Creation:** Users can submit their own events
- **Anonymous Plan Sharing:** Share plans or event recommendations anonymously with the community
- **Upvotes/Likes:** Social features for event plans
- **Automatic Translation:** Show event info in English, French, and other languages
- **Improved Accessibility:** Keyboard navigation and a11y standards
- **Polished UI:** More themes, animations, dark mode toggle, avatars
- **Security:** Secure backend endpoints with Firebase token verification

---

## 👩‍💻 Getting Started

1. **Clone the repo:**  
   `git clone https://github.com/your-team/event-curator.git`
2. **Install dependencies:**  
   `cd client`  
   `npm install`
3. **Set up Firebase Auth:**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/).
   - Enable Email/Password and Google sign-in in Authentication.
   - Copy your Firebase config to `src/firebase.ts`:
     ```ts
     // src/firebase.ts
     import { initializeApp } from "firebase/app";
     import { getAuth, GoogleAuthProvider } from "firebase/auth";
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       // ...etc
     };
     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     export const googleProvider = new GoogleAuthProvider();
     ```
4. **Start the dev server:**  
   `npm run dev`
5. **Open [http://localhost:5173](http://localhost:5173) to view the app.**

---

## ✨ Example User Persona

> Mei, a 22-year-old French exchange student in Tokyo, uses EventCurator to find local festivals, concerts, and art events, plan her weekends, and share recommendations—all in her native language and without missing out due to language barriers.

---

## 📅 Project Roadmap

- [x] MVP UI with auth
- [ ] Live event data integration
- [ ] Timeline/calendar for users
- [ ] User event creation
- [ ] Sharing & upvotes
- [ ] Translations
- [ ] Polish & deploy!

---

## 📣 Contributing

PRs welcome! See [issues](https://github.com/your-team/event-curator/issues) for planned features and bugs.

---

## 📄 License

© 2025 EventCurator

---
