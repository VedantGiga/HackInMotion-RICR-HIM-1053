# Smart Expense Analyzer - API Documentation

Base URL: `/api/v1`

## Authentication

All API endpoints (except registration) require authentication using NextAuth.js (JWT strategy). Include your session cookie in requests.

### `POST /auth/register`
Creates a new user account.
- **Body:** `{ email, password, name }`
- **Response:** `201 Created`

---

## Transactions

### `GET /transactions`
Retrieve all transactions for the authenticated user.
- **Query Params:** `categoryId` (optional)
- **Response:** `200 OK`

### `POST /transactions`
Manually add a transaction.
- **Body:** `{ amount, date, description, categoryId?, isRecurring? }`
- **Response:** `201 Created`

### `POST /transactions/import`
Bulk upload CSV bank statements.
- **Form-Data:** `file` (CSV file)
- **Response:** `201 Created` - Returns count of imported rows.

### `POST /transactions/categorize`
Trigger the automatic categorization engine for any uncategorized transactions.
- **Response:** `200 OK` - Returns count of newly categorized transactions.

### `PUT /transactions/:id`
Update a specific transaction.
- **Body:** `{ amount, date, description, categoryId, isRecurring }`

### `DELETE /transactions/:id`
Delete a specific transaction.

---

## Analysis & Health

### `GET /analysis/spending`
Retrieves spending patterns, month-over-month changes, and potential recurring transactions.
- **Response:** `200 OK`

### `GET /analysis/health`
Calculates and returns the user's overall Financial Health Score (0-100) and personalized AI-style insights based on their savings rate and budget adherence.
- **Response:** `200 OK`

---

## Budgets & Goals

### `GET /budgets`
Retrieves budgets with real-time tracking of current monthly progress (percentage).
- **Query Params:** `month`, `year` (defaults to current)

### `POST /budgets`
Set a new budget limit for a category.
- **Body:** `{ categoryId, limit, month, year }`

### `GET /goals`
Retrieves savings goals with real-time completion tracking.

### `POST /goals`
Create a new savings goal.
- **Body:** `{ name, targetAmount, currentAmount?, deadline? }`
