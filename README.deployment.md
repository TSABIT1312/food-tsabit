# MakanBar - Food Ordering App - Deployment Guide

## Vercel Deployment Instructions

This project is configured for easy deployment on Vercel. Follow these steps:

### Prerequisites
1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

#### Option 1: Deploy via Vercel CLI
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the project directory:
   ```bash
   cd food-ordering-app
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy the project:
   ```bash
   vercel
   ```

5. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name: **food-ordering-app** (or your preferred name)
   - In which directory is your code located? **./**

#### Option 2: Deploy via Vercel Dashboard
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your Git repository
5. Vercel will automatically detect it's a Vite project
6. Configure the following settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `food-ordering-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Environment Variables (Optional)
If you want to use real Firebase configuration in production:

1. In Vercel Dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Update `src/firebase.js` to use these environment variables:
   ```javascript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   ```

### Project Structure
```
food-ordering-app/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── data/
│   └── firebase.js
├── public/
├── dist/ (generated after build)
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

### Features
- ✅ React 18 with Vite
- ✅ React Router for navigation
- ✅ Tailwind CSS for styling
- ✅ Firebase integration (demo mode)
- ✅ Shopping cart functionality
- ✅ Responsive design
- ✅ Admin panel
- ✅ User authentication (when Firebase is configured)

### Demo Mode
The app currently runs in demo mode with mock Firebase configuration. All features work except:
- User registration/login
- Data persistence
- Real-time updates

To enable full functionality, configure real Firebase credentials.

### Build and Test Locally
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Troubleshooting
1. **Build fails**: Check that all dependencies are installed
2. **Routing issues**: Ensure vercel.json has proper route configuration
3. **Firebase errors**: Verify environment variables are set correctly
4. **CSS not loading**: Check Tailwind CSS configuration

### Support
For issues related to deployment, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
