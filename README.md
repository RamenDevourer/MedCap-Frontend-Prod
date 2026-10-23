# MedCap - AI-Powered Healthcare Analysis  

🚀 **AI-driven healthcare platform for analyzing medical reports and providing personalized recommendations.**  

## 🔗 Website  
[MedCap Live](https://medcap.vercel.app/)  

## 📌 Overview  
MedCap is an AI-powered platform that processes PDF medical reports to generate personalized healthcare plans. It provides a user-friendly dashboard for managing reports, tracking history, and receiving AI-based health suggestions.  

## ✨ Features  
- 📄 **AI-Based Report Analysis** – Extracts key insights from medical PDFs to generate recommendations.  
- 🔒 **Secure Authentication** – Implements JWT for authentication and Firebase for profile picture management.  
- 📊 **User Dashboard** – Tracks past reports, manages profiles, and offers AI-driven health suggestions.  
- 📬 **Real-Time Suggestions** – Enhances user experience by analyzing historical data for improved recommendations.  

## 🛠 Tech Stack  
- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT, Firebase  
- **PDF Processing:** Adobe API  

---

> This repository is the **frontend** only.

## Frontend stack

- React 18, React Router 6, Vite 5
- Tailwind CSS 3 with a small design system in `tailwind.config.js` and `src/index.css`
- Self-hosted fonts via Fontsource: Fraunces (display), Figtree (body), JetBrains Mono (labels)
- Icons from `lucide-react`; HTTP via `axios`
- Deployed on Vercel (`vercel.json` rewrites all routes to the SPA)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

The backend URL lives in `src/components/server_url.jsx` (production: `https://medcap-backend.vercel.app`; switch the commented line for local development on `http://localhost:5555`).

## Structure

```
src/
  pages/             Homepage, Login, Signup, Report (form), HealthcareReport (plan), UserDashboard
  components/
    home/            Hero and homepage sections
    ui/              Shared primitives: PageShell, AuthLayout, Logo, Avatar, EcgLine, RichValue
    Header, Footer, Modal, LoadingPopup, AnalysisHistory, EditProfileForm, UserDetails, ErrorBoundary
  lib/session.js     Reads/clears the localStorage session (accessToken, user, loggedIn)
  utils/             Date formatting and value helpers
```

## Design notes

- Palette: warm paper background, deep ink text, MedCap magenta as the single accent. Tokens are
  Tailwind colours (`paper`, `ink`, `line`, `brand`, `sage`, `amber`, `rose`, `violet`).
- Reusable classes in `index.css`: `btn-primary`, `btn-brand`, `btn-ghost`, `btn-danger`, `card`,
  `input`, `label`, `eyebrow`, `chart-grid`, `grain`.
- The ECG trace (`components/ui/EcgLine.jsx`) is the recurring visual motif.
- Animations respect `prefers-reduced-motion`.
