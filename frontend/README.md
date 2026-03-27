# ShopNest Frontend

Customer-facing web app for browsing products, managing cart, and placing orders.

## Tech Stack

- React 18 + Vite
- React Router
- Axios
- Tailwind CSS
- Framer Motion
- React Toastify

## Requirements

- Node.js 18+
- npm 9+

## Environment Variables

Create an `.env` file in this folder:

```env
VITE_BACKEND_URL=http://localhost:4000
```

This value is required to call backend APIs.

## Install and Run

```bash
npm install
npm run dev
```

Default dev server port: `5173`

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Notes

- Start the backend before running the frontend.
- Checkout/payment flows depend on backend payment configuration.
