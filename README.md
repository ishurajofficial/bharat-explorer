# 🌍 Bharat Explorer

> An interactive, beautifully designed travel dashboard to track your journeys across the Incredible States and Union Territories of India.

![Bharat Explorer Cover](https://via.placeholder.com/1200x600/0a0a1a/FFFFFF?text=Bharat+Explorer)

## ✨ Features

- **Interactive SVG Map**: A complete, highly-accurate map of all 28 States and 8 Union Territories of India.
- **Visual Progress**: Color-coded states to differentiate between places you've visited, and places on your wishlist.
- **Travel Journal**: Add personal notes, dates, ratings, and travel companions for each state you visit.
- **Stunning UI/UX**: Built with a modern glassmorphism aesthetic inspired by Apple, Stripe, and modern design trends. Smooth animations powered by Framer Motion.
- **Cloud Sync**: Seamlessly syncs your travel map across devices using Google Sign-In and Firebase Cloud Firestore.
- **Data Export**: Export your travel history as a JSON file for local backup.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: TailwindCSS & shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Backend & Auth**: Firebase (Google Auth, Cloud Firestore)
- **Icons**: Lucide React

## 💻 Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/bharat-explorer.git
cd bharat-explorer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Firebase
By default, the project is configured to use a live Firebase backend for authentication. If you want to use your own Firebase project:
1. Create a project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Google Sign-In under **Authentication > Sign-in method**
3. Create a **Cloud Firestore** database
4. Update the config in `src/lib/firebase.ts`

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🛡️ Firestore Security Rules

If setting up your own Firebase backend, deploy these rules to secure the database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📜 License

This project is licensed under the MIT License.
