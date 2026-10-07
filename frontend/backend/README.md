# RentEase Backend Architecture

This folder contains the standalone and modular Express REST Backend layer for RentEase:

## Structure

- **`app.ts`**: Express application factory. Mounts JSON body parser, CORS headers for external frontend requests, and routes.
- **`config/db.ts`**: MongoDB Atlas connection manager targeting `cluster0.kk44seh.mongodb.net`, with collection auto-seeding and resilient in-memory fallback.
- **`data/seedData.ts`**: Seed dataset for products, initial orders, tickets, claims, and service cities.
- **`routes/`**: Modular REST endpoints:
  - `health.ts`: `GET /api/health`
  - `products.ts`: `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id`
  - `orders.ts`: `GET /api/orders`, `POST /api/orders`, `PUT /api/orders/:id/status`, `POST /api/orders/:id/extend`, `POST /api/orders/:id/relocate`, `POST /api/orders/:id/return`
  - `tickets.ts`: `GET /api/tickets`, `POST /api/tickets`, `PUT /api/tickets/:id`
  - `claims.ts`: `GET /api/claims`, `PUT /api/claims/:id`
  - `cities.ts`: `GET /api/cities`, `PUT /api/cities/:id/toggle`
  - `analytics.ts`: `GET /api/analytics/kpis`
- **`types/index.ts`**: Shared TypeScript models and interfaces.
- **`server.ts`**: Dedicated standalone backend server script (`PORT=5000` or `BACKEND_PORT`).

## Integration with Root Server

The root `server.ts` imports `createApp` from `./backend/app.ts` and runs the full-stack server on port 3000 with Vite middleware, ensuring both frontend and backend work synchronously in development and production.
