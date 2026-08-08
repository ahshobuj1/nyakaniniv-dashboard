<div align="center">
  
  # 🚀 React Admin Dashboard Template
  **A highly scalable, feature-rich admin dashboard template built with modern web technologies.**

  [![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Shadcn UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
  [![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
  
</div>

---

## 📖 Overview

This dashboard project is a **production-ready boilerplate** meant to be used as a starting point for complex administrative interfaces. It includes a thoroughly designed architecture, beautifully crafted UI components via [Shadcn UI](https://ui.shadcn.com/), state management via Redux Toolkit, and fully functional layouts with complex data tables (including sorting, filtering, and pagination out of the box).

### ✨ Key Features
- **Modern Stack:** React 19, TypeScript, and Vite.
- **Lightning Fast:** Uses `bun` as the package manager for incredibly fast installs and script execution.
- **Component Library:** Beautifully styled, accessible components using **Shadcn UI** and **Tailwind CSS**.
- **State Management:** **Redux Toolkit** configured natively for global state, auth state, and complex UI state.
- **Routing:** Built with **React Router v7** using the modern `createBrowserRouter` standard.
- **Advanced Tables:** Dynamic, highly functional data tables with pagination, sorting, and filtering built-in.
- **Ready for API Integration:** Pre-configured Axios/Fetch layers ready to connect to your real API (e.g. `https://api.upbeat.africa`).

---

## 🏗 Project Architecture

The codebase follows a scalable **feature-driven** folder structure inside the `src` directory:

```text
src/
├── app/          # App-wide configurations (e.g., React Router config, Redux store setup)
├── assets/       # Static assets like images, fonts, and SVGs
├── components/   # Reusable UI components (Shadcn UI elements, buttons, inputs, modals)
├── features/     # Feature-specific logic (Redux slices, thunks, API calls)
├── hooks/        # Custom reusable React hooks (e.g., useAuth, useDebounce)
├── layout/       # Structural layout components (Sidebar, Topbar, Dashboard Layout wrapper)
├── lib/          # Core utilities and library configurations (Axios instances, Shadcn cn utility)
├── pages/        # Route-level page components (Dashboard, Users, Transactions, Login)
└── utils/        # Helper functions, formatters, and constants
```

### 🧩 How to Build New Pages
1. **Create the Page:** Add a new folder in `src/pages/` (e.g., `src/pages/Products/Products.tsx`).
2. **Add to Router:** Import and append your new page component to the routes array in `src/app/router.tsx`.
3. **State Management:** If your page needs global state, create a slice in `src/features/` and add it to the Redux store in `src/app/store.ts`.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Bun](https://bun.sh/) installed globally on your machine.

### Installation

1. **Clone & Install Dependencies:**
   Navigate into the dashboard directory and install packages using Bun:
   ```bash
   bun install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory. Configure your API base URL and any other necessary secrets:
   ```env
   VITE_API_BASE_URL=https://api.upbeat.africa
   ```

3. **Start Development Server:**
   Launch the Vite development server:
   ```bash
   bun run dev
   ```
   *The application will be running locally at `http://localhost:5173` (or port specified by Vite/Bun).*

---

## 📦 Build for Production

To create an optimized production build of the dashboard:

```bash
bun run build
```
The output will be generated inside the `dist` folder. You can preview the production build locally using:
```bash
bun run preview
```

---

## 🛠 Included Tooling

- **ESLint & Prettier:** Pre-configured for strict code quality and consistent formatting. Run `bun run lint` to check for issues.
- **Tailwind Merge & CLSX:** Utility functions (`cn`) located in `src/lib/utils.ts` are heavily used to merge dynamic Tailwind classes cleanly.
- **Lucide Icons:** A massive library of crisp SVG icons pre-installed via `lucide-react`.
