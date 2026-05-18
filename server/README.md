## Backend

This directory contains the Express API, MongoDB connection layer, Mongoose models, and seed data for the project.

### Main Files

- `index.js`: starts the API server and mounts the route modules
- `db.js`: opens the MongoDB connection using `MONGODB_URI` and `MONGODB_DB`
- `models/`: Mongoose models for users, products, specialists, services, and orders
- `routes/`: route files grouped by auth, products, services, specialists, orders, users, and system endpoints
- `mockdata.json`: seed source data for products, specialists, services, and sample records
- `scripts/seed.js`: loads `mockdata.json` into MongoDB
- `package.json`: backend runtime scripts and dependencies

### Environment

Expected variables in `.env`:

- `PORT`
- `MONGODB_URI`
- `MONGODB_DB`
- `CLIENT_ORIGIN`

### Common Commands

```bash
npm start
npm run dev
npm run seed
```

The frontend application lives in `client/`.
