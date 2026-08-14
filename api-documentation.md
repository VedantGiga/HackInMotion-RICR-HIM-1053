# 📑 Koshin AI — Complete API Specification Documentation

> **Base URL:** `/api/v1`  
> **Protocol:** HTTPS  
> **Authentication Strategy:** NextAuth.js JWT Session Cookie or Bearer Token  
> **Format:** `application/json`

---

## 🔐 1. Authentication Endpoints

### 1.1 Register User Account
Creates a new user account with hashed password credentials.
* **Endpoint:** `POST /api/v1/auth/register`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "Jane Doe",
    "phone": "+1234567890"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": "usr_9481a8b2-29bf-4819",
      "email": "user@example.com",
      "name": "Jane Doe",
      "createdAt": "2026-08-14T10:00:00.000Z"
    },
    "message": "User registered successfully"
  }
  ```

### 1.2 Send Email Verification Code
Generates a 6-digit email OTP and dispatches via EmailJS / SMTP with non-blocking lifecycle handling.
* **Endpoint:** `POST /api/v1/auth/send-verification`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "emailSent": true,
    "code": "849201",
    "message": "Verification code sent to your email address"
  }
  ```

### 1.3 Verify Email Code
Validates the 6-digit verification code.
* **Endpoint:** `POST /api/v1/auth/verify`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "code": "849201"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Email address verified successfully"
  }
  ```

---

## 💳 2. Transaction Management Endpoints

### 2.1 Fetch User Transactions
Retrieves transactions scoped exclusively to the authenticated user.
* **Endpoint:** `GET /api/v1/transactions`
* **Auth Required:** Yes
* **Query Parameters:**
  * `categoryId` *(optional)*: Filter by category ID.
  * `type` *(optional)*: `expense` or `income`.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "tx_1849201",
        "date": "2026-08-14T00:00:00.000Z",
        "amount": 148.50,
        "description": "Apple Store Purchase",
        "merchant": "Apple",
        "category": {
          "id": "cat_shopping",
          "name": "Shopping",
          "type": "expense"
        },
        "confidence": 0.95,
        "isRecurring": false
      }
    ],
    "message": "Transactions retrieved successfully"
  }
  ```

### 2.2 Create Individual Transaction
Manually adds a new transaction record.
* **Endpoint:** `POST /api/v1/transactions`
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "amount": 12.50,
    "date": "2026-08-14",
    "description": "Starbucks Coffee",
    "categoryName": "Food & Dining",
    "isRecurring": false
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": "tx_992104",
      "amount": 12.50,
      "date": "2026-08-14T00:00:00.000Z",
      "description": "Starbucks Coffee",
      "merchant": "Starbucks Coffee",
      "confidence": 0.95,
      "isRecurring": false
    },
    "message": "Transaction created successfully"
  }
  ```

### 2.3 Import Bank Statements (CSV / PDF)
Multi-pass statement extraction engine with preview or direct batch insertion.
* **Endpoint:** `POST /api/v1/transactions/import?preview=true`
* **Auth Required:** Yes
* **Content-Type:** `multipart/form-data` or `application/json` (batch JSON)
* **Form Field:** `file` (CSV or PDF bank statement)
* **Response (200 OK Preview):**
  ```json
  {
    "success": true,
    "data": {
      "preview": [
        {
          "id": "csv_0_172363",
          "date": "2026-08-10",
          "description": "Netflix Subscription",
          "merchant": "Netflix",
          "category": "Subscriptions",
          "confidence": 0.95,
          "amount": 15.99,
          "type": "expense",
          "isRecurring": true,
          "selected": true
        }
      ],
      "count": 1
    },
    "message": "Parsed 1 transactions for review"
  }
  ```

### 2.4 Update Transaction
* **Endpoint:** `PUT /api/v1/transactions/:id`
* **Request Body:** `{ "amount": 14.99, "categoryName": "Subscriptions" }`
* **Response (200 OK):** `Updated transaction payload`

### 2.5 Delete Transaction
* **Endpoint:** `DELETE /api/v1/transactions/:id`
* **Response (200 OK):** `{ "success": true, "message": "Transaction deleted" }`

---

## 📈 3. Spending Analytics & Financial Health

### 3.1 Spending Breakdown & Trends
Calculates category spending totals, top spending categories, and month-over-month variances.
* **Endpoint:** `GET /api/v1/analysis/spending`
* **Auth Required:** Yes
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "totalSpent": 2450.00,
      "categories": [
        { "name": "Housing & Rent", "amount": 1200.00, "percentage": 48.9 },
        { "name": "Food & Dining", "amount": 450.00, "percentage": 18.3 }
      ],
      "topCategory": "Housing & Rent",
      "momChange": -4.2
    }
  }
  ```

### 3.2 Dynamic Financial Health Score & Recommendations
Calculates 0–100 Financial Health Score weighted across Savings Rate (30%), Income/Expense Ratio (30%), Budget Adherence (20%), and Subscription Drain (20%).
* **Endpoint:** `GET /api/v1/analysis/health`
* **Auth Required:** Yes
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "score": 88,
      "status": "Excellent",
      "factors": {
        "savingsRate": 32.5,
        "incomeExpenseRatio": 1.48,
        "budgetAdherence": 90.0,
        "subscriptionRatio": 8.5
      },
      "recommendations": [
        "You saved 32.5% of your income this month — great progress towards your emergency fund!",
        "Subscriptions represent 8.5% of your spending. You could save $38/mo by cancelling unused tiers."
      ]
    }
  }
  ```

---

## 🎯 4. Budgets, Goals & AI Assistant

### 4.1 Get Category Budgets
* **Endpoint:** `GET /api/v1/budgets?month=8&year=2026`
* **Response (200 OK):** List of category budget limits with spent amounts and progress percentages.

### 4.2 Save Category Budget
* **Endpoint:** `POST /api/v1/budgets`
* **Request Body:** `{ "categoryName": "Food & Dining", "limit": 500 }`
* **Response (201 Created):** `{ "success": true, "data": { "limit": 500, "spent": 180 } }`

### 4.3 Get Savings Goals
* **Endpoint:** `GET /api/v1/goals`
* **Response (200 OK):** List of goals (Name, Target Amount, Current Saved, Deadline).

### 4.4 Create Savings Goal
* **Endpoint:** `POST /api/v1/goals`
* **Request Body:** `{ "name": "Emergency Fund", "targetAmount": 5000, "currentAmount": 1500 }`

### 4.5 AI Co-Pilot Natural Language Assistant
* **Endpoint:** `POST /api/v1/ai/chat`
* **Request Body:** `{ "message": "How much did I spend on food this month?" }`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "reply": "You spent $450.00 on Food & Dining this month across 14 transactions. That is 18.3% of your total expenses."
  }
  ```
