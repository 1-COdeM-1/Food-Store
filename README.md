# 🍗 CrispyBites - Modern Food Store

![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-brown?style=for-the-badge)

A premium, highly interactive E-Commerce web application built specifically for a modern food and fried chicken restaurant. The platform offers a seamless shopping experience with a stunning UI, full bilingual support, and comprehensive shopping features.

🔗 **Live Demo:** [https://food-store-weld.vercel.app/](https://food-store-weld.vercel.app/)

---

## ✨ Key Features

- **🍔 Stunning UI/UX**: Designed with a sleek, appetizing "Yellow and Black" theme.
- **🌓 Dark/Light Mode**: Full support for system, light, and dark mode themes, ensuring great visibility in any environment.
- **🌍 Bilingual Support (i18n)**: Fully localized in both **Arabic (Default, RTL)** and **English (LTR)**.
- **🛒 Shopping Features**: Includes a complete product catalog, detailed product views, and a Wishlist system.
- **📱 Responsive Design**: Perfectly tailored for mobile, tablet, and desktop viewing.
- **⚡ Fast & Optimized**: Built on Vite for lightning-fast HMR and optimized production builds.
- **💬 WhatsApp Integration**: Direct order integration via WhatsApp for easy customer communication.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI (shadcn/ui)](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router](https://reactrouter.com/)
- **Localization**: [react-i18next](https://react.i18next.com/)
- **Database / Backend SDK**: [Supabase](https://supabase.com/)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1-COdeM-1/Food-Store.git
   cd Food-Store/chickens/store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## 📁 Project Structure

```text
src/
├── components/       # Reusable UI components (buttons, cards, inputs)
├── constants/        # Application-wide constants and configurations
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts (Navbar, Footer, Main Layout)
├── lib/              # Utility libraries (Supabase client, clsx/tailwind-merge)
├── locales/          # i18n translation files (en, ar)
├── pages/            # Application routes/pages (Home, Shop, Product, etc.)
├── services/         # API calls and backend services
├── store/            # Zustand state management stores
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## 🚢 Deployment

This project is configured for seamless deployment on **Vercel**. 
The repository includes a `vercel.json` file which handles Single Page Application (SPA) routing, ensuring that React Router handles all page reloads properly.

To deploy your own instance:
1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Configure the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel's Environment Variables settings.
4. Deploy!
