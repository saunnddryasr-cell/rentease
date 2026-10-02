# RentEase Backend

Backend API for **RentEase** — a Furniture & Appliance Rental Platform.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Vercel (serverless deployment)

## API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/me` | Private |

### Products
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| GET | `/api/products/vendor/mine` | Vendor/Admin |
| POST | `/api/products` | Vendor/Admin |
| PUT | `/api/products/:id` | Vendor/Admin |
| DELETE | `/api/products/:id` | Vendor/Admin |

### Rentals
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/rentals` | Private |
| GET | `/api/rentals/my` | Private |
| GET | `/api/rentals/:id` | Private |
| POST | `/api/rentals/:id/return` | Private |
| POST | `/api/rentals/:id/extend` | Private |
| POST | `/api/rentals/:id/cancel` | Private |

### Maintenance
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/maintenance` | Private |
| GET | `/api/maintenance/my` | Private |
| PUT | `/api/maintenance/:id/status` | Vendor/Admin |

### Admin
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/stats` | Admin |
| GET | `/api/admin/users` | Admin |
| GET | `/api/admin/rentals` | Admin |
| GET | `/api/admin/deliveries` | Admin |
| PUT | `/api/admin/deliveries/:id` | Admin |

## Local Development
```bash
npm install
cp .env.example .env
npm run dev