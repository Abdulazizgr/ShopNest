# ShopNest Backend API

Node.js/Express API for authentication, products, cart, and orders used by web, admin, and mobile apps.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Cloudinary (image storage)
- Stripe and Chapa (payments)

## Requirements

- Node.js 18+
- npm 9+
- MongoDB connection string

## Environment Variables

Create a `.env` file in this folder:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

CHAPA_AUTH=your_chapa_secret_key
CHAPA_URL=https://api.chapa.co/v1/transaction/initialize
```

## Install and Run

```bash
npm install
npm run dev
```

Runs on `http://localhost:4000` by default.

## Available Scripts

- `npm run dev` - start with nodemon
- `npm start` - start with node

## API Route Groups

- `/api/user`
- `/api/product`
- `/api/cart`
- `/api/order`

## Notes

- Ensure MongoDB and Cloudinary credentials are valid before uploading products.
- Stripe and Chapa features require their corresponding keys.