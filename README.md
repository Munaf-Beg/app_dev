# Apogee 🚀
**The Ultimate Fest Event Explorer (Prototype)**

Apogee is a sleek, high-performance mobile prototype designed to help users navigate, discover, and manage university fest events. Built strictly with React Native and Expo, and heavily typed using **TypeScript**, it offers a seamless offline-first experience for browsing schedules, filtering by categories, and saving favorite events. 

## 📱 Visual Showcase & Design Philosophy
Apogee's UI/UX is the result of extensive creative exploration. By utilizing **Stitch by Google** to generate and evaluate multiple app design concepts, the final aesthetic was carefully curated to blend a futuristic vibe with **Google's Material Design** principles (via React Native Paper). 

* **Dark UI & Neon Highlights:** A deep, high-contrast dark theme accented by vibrant neon cyan and deep magenta, evoking a modern, cyberpunk-inspired atmosphere.
* **Fluid Material Interactions:** Standardized ripples, intuitive typography, and structured layouts inspired by Google's design language ensure the app feels both experimental and highly accessible.

## ✨ Key Features
* **Smart Search:** Lightning-fast, typo-tolerant event searching powered by `Fuse.js`.
* **Dynamic Filtering & Sorting:** Instantly filter events by category (Music, Tech, Dance, Misc) or sort them chronologically and by popularity (registrations).
* **Personalized Itinerary:** Users can toggle and save their favorite events, creating a custom schedule that persists across sessions.
* **Real-time Analytics:** Dashboard overview displaying total event counts and top trending categories.

## 💾 Local Database Architecture (SQLite)
Apogee utilizes a robust local database strategy using **SQLite** to ensure the app is fast, responsive, and capable of offline functionality. 

* **Data Initialization:** On application mount, the database asynchronously boots and loads the complete catalog of fest events directly into memory.
* **Persistent User Preferences:** The app securely stores user-saved events (bookmarks/itineraries) locally. By using `toggleSavedEvents`, the UI instantly updates state while the SQLite database silently handles the insertion or deletion of saved event IDs in the background.
* **Optimized Queries:** Custom asynchronous data wrappers (`getEventsFromDB`, `getEventsTotal`) ensure that UI rendering is never blocked by database transactions.

## 🛠️ Tech Stack
* **Framework:** React Native & Expo
* **Language:** TypeScript (Strictly typed for scalability and error reduction)
* **Local Storage:** SQLite
* **UI Components:** React Native Paper (Google Material Design)
* **Icons:** `@expo/vector-icons` (MaterialCommunityIcons)
* **Search Engine:** `Fuse.js` (Fuzzy Search)

## 📂 Project Structure
```text
Apogee/
├── app/                   # Expo Router entry points
│   ├── _layout.tsx        # Main navigation and layout wrap
│   └── index.tsx          # The main explorer screen and UI logic
├── assets/
│   └── images/            # Static assets, backgrounds, and icons
├── src/
│   ├── components/        # Reusable UI components (e.g., EventCards)
│   └── data/              # SQLite Database configuration, types, and queries
├── app.json               # Expo configuration
├── eas.json               # Expo Application Services configuration
├── package.json           # Dependencies and project scripts
└── tsconfig.json          # TypeScript compiler options
