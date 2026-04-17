# AI Retail Stylist — "The Synthetic Atelier"

![App Showcase](https://via.placeholder.com/1200x500.png?text=The+Synthetic+Atelier)

An intelligent, production-grade e-commerce platform that enhances the shopping experience through real-time data, automation, and hyper-personalized recommendations via native, browser-driven AI.

## Core Features

- **Real-Time Catalog Pipeline:** Dynamically fetches and parses global product structures from the [DummyJSON API](https://dummyjson.com), ensuring fresh, live retail inventory while mapping to our overarching internal styling criteria.
- **Weather-Aware AI Agent:** Automatically ingests local user temperature and wind velocity using `wttr.in`, feeding atmospheric context directly into the AI to curate "warm", "technical", or "breathable" constraints locally.
- **Natural Language Parsing:** Powered by the **Cerebras Inference API** (`Llama-3.1-8B`), the system effortlessly translates user strings (e.g., *"I need an edgy jacket for a rainy day"*) into strict JSON UI filters at near-instant latency.
- **Full Inventory CRUD Dashboard:** Natively built `/manage` administrative root allows users to instantly append private custom listings atop external DummyJSON data sources in real time.
- **Industrial Minimalist Aesthetics:** Forged through a highly structured Tailwind layout, strictly honoring "Tonal Depth" and "Extreme Radius" (detailed inside `DESIGN.md`).

---

## The Tech Stack

- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **State Management:** Native Context API (`InventoryContext`, `CartContext`)
- **Intelligence Model:** [Cerebras Llama-3.1-8B](https://cerebras.ai/) (Replacing standard Gemini architectures via standard fetch structure)
- **Icons:** [Lucide-React](https://lucide.dev/)

---

## Running Locally

To build and run this repository locally without throwing Neural Integration errors, you'll need a free Cerebras API key.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Praveen-1503/AMD-Campus-Days.git
   cd AMD-Campus-Days
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the Environment:**
   Initialize your local environment block:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and substitute your Cerebras access token inside:
   ```env
   VITE_CEREBRAS_API_KEY="your_api_key_here"
   ```

4. **Launch the Engine:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173/` to view the running instance.

---

## Project Structure

```bash
src/
├── components/          # Reusable, encapsulated UI blocks (WeatherBanner, Navbar, ProductCard)
├── contexts/            # Global operational memory (Cart & Inventory hydration)
├── hooks/               # Core intelligence layers (useAssistantAgent, useProductAPI, useWeather)
├── pages/               # Primary navigational structures
└── data/                # Fallback catalogs allowing the site to persist through API degradation
```

## Design Philosophy

The overarching UX mandate runs entirely through **DESIGN.md**. It strictly enforces monochromatic charcoal depth gradients and forbids structural UI bordering—forcing all architectural component separation to exist through backdrop coloration.

---

_Built dynamically to fulfill the Retail & E-commerce Operational mandate._ 
