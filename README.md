# D&D Gear Generator Frontend

A single‐page application for generating custom Dungeons & Dragons gear and shopkeeper profiles. Built with React, TypeScript and Vite, it consumes a backend API to send and fetch prompts to Gemini 2.0 Flash and GPT 4.1-mini. 

---

## Table of Contents

# - [Demo](#demo)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Development](#development)  
  - [Building for Production](#building-for-production)  
- [Project Structure](#project-structure)  
- [Configuration](#configuration)  
- [License](#license)  
# ![Demo of the gear and shopkeeper generator in action](https://user-images.githubusercontent.com/your-username/demo.gif)

--- 

## Features

- **Generate Random Gear**  
  Fill out or leave blank fields to produce magic weapons, armor, jewelry, and more.  
- **Generate Shopkeeper Profiles**  
  Choose race, settlement size, and shop type to spin up a unique NPC shopkeeper.  
- **Copy & Re-Roll**  
  Easily copy plain text output to clipboard or re-roll for another result.  
- **Smooth Animations**  
  Powered by Framer Motion for loading states and modals.  

---

## Tech Stack

- **[Vite](https://vitejs.dev/)** with TypeScript  
- **React 18**  
- **Axios** for HTTP requests  
- **Framer Motion** for UI animations  
- **ESLint** with React Hooks plugin  
- **CSS Modules** (plain CSS files per component)  

---

## Getting Started

### Prerequisites

- **Node.js** v16+  
- **npm** v8+ (or **Yarn** v1.22+)  

### Installation

1. **Clone the repo**  
```bash
git clone https://github.com/your-username/dndgamegen.com.git
cd dndgamegen.com
``` 

2. **Install dependencies**
```bash
npm install
# or
yarn install
``` 

### Development

Start the Vite dev server on port 5173 (with API proxy to port 5000): 
```bash
npm run dev
# or 
yarn dev
``` 
Open your browser to http://localhost:5173. 

## Building for Production 
1. **Build Assets** 
```bash
npm run build
# or 
yarn preview
``` 
The preview server also runs on port 4173 by default. 

## Project Structure 
```css
.
├── public/
│   ├── index.html           # Main HTML template
│   └── dragon-logo.svg
├── src/
│   ├── components/
│   │   ├── NavBar.tsx
│   │   ├── NavBar.css
│   │   ├── GearForm.tsx
│   │   ├── GearForm.css
│   │   ├── ShopkeeperForm.tsx
│   │   ├── ShopkeeperForm.css
│   │   ├── ResponseModal.tsx
│   │   ├── ResponseModal.css
│   │   ├── ShopkeeperModal.tsx
│   │   ├── Footer.tsx
│   │   └── Footer.css
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE.md
└── README.md                 # ← You are here
``` 

## Configuration
-   **Vite Proxy**
    In `vite.config.ts`, all requests to `/api/*` are forwarded to `http://localhost:5000`.

-   **API Base URL**
    The frontend assumes your backend is running on `http://localhost:5000`. If you host elsewhere, update the proxy or switch to an absolute URL in your `axios` calls.

## License 
This project is licensed under the GNU GPL v3 viewable [here.](https://github.com/AleksZieba/dnd-ai-generators-frontend/blob/main/LICENSE.md)




