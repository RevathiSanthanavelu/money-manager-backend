# Money Manager Backend

A Node.js/Express REST API for managing income and expenses.

## Features

- User authentication with JWT
- Add, edit, delete income/expense transactions
- Filter transactions by category, division, date range
- Dashboard with income/expense summary
- Edit transactions within 12 hours
- Category-wise breakdown

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file (use `.env.example` as reference)
4. Run: `npm run dev`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Transactions
- `POST /api/transactions` - Add transaction
- `GET /api/transactions` - Get transactions (with filters)
- `GET /api/transactions/dashboard` - Get dashboard data
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## Environment Variables

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
