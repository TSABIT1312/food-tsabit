# MakanBar - Food Ordering App

A modern React.js food ordering application built with Vite, Tailwind CSS, Framer Motion, and Firebase.

## Features

- 🏠 Home page with promotions and search
- 🍔 Menu listing with categories and search
- 📱 Product details with add to cart functionality
- 🛒 Shopping cart with real-time updates
- 💳 Checkout process with promo codes
- 💰 Payment integration with multiple methods
- 📦 Order tracking with real-time status updates
- 🔐 User authentication (Login/Register)
- 👤 User profile management
- 📱 Fully responsive design
- ✨ Smooth animations with Framer Motion

## Tech Stack

- **Frontend**: React.js 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Backend**: Firebase v9 (Auth, Firestore, Storage)
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Update `src/firebase.js` with your Firebase configuration

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
├── context/            # React Context providers
├── data/               # Static data and mock data
├── pages/              # Page components
├── firebase.js         # Firebase configuration
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Enable Storage (optional)
5. Update the Firebase configuration in `src/firebase.js`

## Deployment

The app is ready to be deployed to:
- Vercel
- Netlify
- Firebase Hosting

## License

MIT License
