# Expense Tracker — Full Stack Java & React Project

A simple, realistic, and clean **Expense Tracker** application built for a Java Full Stack developer portfolio. The application allows users to record, categorize, track, and analyze personal daily expenditures through an interactive dashboard and complete CRUD operations.

---

## 📌 Project Overview

Managing personal finances is an essential daily need. This application provides a lightweight solution where users can:
- Record new expenditures with categories, dates, and amounts.
- Filter expenses by category to see targeted spending.
- Edit and delete past transactions with instant recalculation.
- View high-level financial metrics (Total Spend, Transaction Count, Top Spending Category).
- Visualize category-wise spending distribution using a proportional bar chart.

The backend is built with **Spring Boot** following clean layered architecture (`controller`, `service`, `repository`, `entity`, `dto`, `exception`), while the frontend is built with **React**, **Vite**, **Axios**, and **React Router**.

---

## ✨ Features

- **Dashboard**:
  - Key Performance Indicators (Total Spend, Total Expenses, Top Spending Category).
  - Dynamic Category-wise spending bar chart with percentage calculation.
  - Category breakdown summary table.
  - Recent transactions quick-view.
- **Add Expense**:
  - Form with Title, Amount, Category, Date, and optional Description.
  - Input validation (client-side and server-side Jakarta Bean Validation).
- **Expense List**:
  - Full table of recorded expenses sorted by date (latest first).
  - Category filter dropdown (*All, Food, Travel, Shopping, Bills, Education, Health, Other*).
  - Filtered total amount calculation in real time.
  - Inline Edit and Delete buttons with confirmation dialogs.
- **Edit Expense**:
  - Pre-populated form fetching data by ID.
  - Validation and update submission back to the server.
- **Robust Exception Handling**:
  - Unified JSON error responses for 404 (Not Found) and 400 (Validation Failure).

---

## 🛠 Tech Stack

### Backend
* **Language**: Java 17+
* **Framework**: Spring Boot 3.3.5
* **Web**: Spring Web (RESTful API)
* **Database Access**: Spring Data JPA / Hibernate
* **Database**: MySQL (Production) / H2 In-Memory (Testing & Quick Evaluation)
* **Validation**: Jakarta Bean Validation (`@NotBlank`, `@NotNull`, `@Positive`)
* **Build Tool**: Apache Maven (via Maven Wrapper `mvnw`)
* **Testing**: JUnit 5, Mockito, MockMvc

### Frontend
* **Library**: React 18 (JavaScript)
* **Build Tool**: Vite
* **HTTP Client**: Axios
* **Routing**: React Router DOM (v6)
* **Styling**: Pure, responsive modern CSS (No heavy CSS framework dependencies)

---

## 🗄 Database Structure

The application uses a single normalized table named `expenses` in MySQL:

### Table: `expenses`

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | Primary Key, Auto Increment | Unique identifier |
| `title` | `VARCHAR(255)` | NOT NULL | Expense title/name |
| `amount` | `DOUBLE` | NOT NULL, > 0 | Expense amount in currency |
| `category` | `VARCHAR(255)` | NOT NULL | One of the standard categories |
| `date` | `DATE` | NOT NULL | Transaction date (`YYYY-MM-DD`) |
| `description` | `VARCHAR(500)` | Nullable | Optional notes/details |

### Supported Categories:
* `Food`
* `Travel`
* `Shopping`
* `Bills`
* `Education`
* `Health`
* `Other`

---

## 🔌 API Endpoints

Base URL: `http://localhost:8080/api/expenses`

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/expenses` | Create a new expense | `ExpenseRequest` JSON | Created `Expense` (201) |
| `GET` | `/api/expenses` | Get all expenses (descending date order) | None | `List<Expense>` (200) |
| `GET` | `/api/expenses?category={cat}` | Filter expenses by category | None | `List<Expense>` (200) |
| `GET` | `/api/expenses/{id}` | Get single expense by ID | None | `Expense` (200) / 404 |
| `PUT` | `/api/expenses/{id}` | Update an existing expense | `ExpenseRequest` JSON | Updated `Expense` (200) |
| `DELETE`| `/api/expenses/{id}` | Delete an expense by ID | None | No Content (204) / 404 |
| `GET` | `/api/expenses/summary` | Get summary statistics & category breakdown | None | `ExpenseSummaryResponse` (200) |

### Sample JSON Payloads

#### Create / Update Request (`POST` / `PUT`):
```json
{
  "title": "Monthly Electricity Bill",
  "amount": 75.50,
  "category": "Bills",
  "date": "2026-03-07",
  "description": "Electricity bill for March"
}
```

#### Summary Response (`GET /api/expenses/summary`):
```json
{
  "totalExpense": 159.70,
  "totalCount": 3,
  "categoryWiseTotal": {
    "Bills": 75.50,
    "Food": 54.20,
    "Travel": 30.00
  }
}
```

#### Validation Error Response (`400 Bad Request`):
```json
{
  "timestamp": "2026-03-08T22:40:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input provided",
  "validationErrors": {
    "amount": "Amount must be greater than 0",
    "title": "Title is required",
    "category": "Category is required",
    "date": "Date is required"
  }
}
```

---

## 📂 Project Structure

```
Expense tracker/
├── backend/
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/com/expensetracker/
│       │   │   ├── ExpenseTrackerApplication.java
│       │   │   ├── config/
│       │   │   │   └── CorsConfig.java
│       │   │   ├── controller/
│       │   │   │   └── ExpenseController.java
│       │   │   ├── service/
│       │   │   │   ├── ExpenseService.java
│       │   │   │   └── ExpenseServiceImpl.java
│       │   │   ├── repository/
│       │   │   │   └── ExpenseRepository.java
│       │   │   ├── entity/
│       │   │   │   └── Expense.java
│       │   │   ├── dto/
│       │   │   │   ├── ExpenseRequest.java
│       │   │   │   └── ExpenseSummaryResponse.java
│       │   │   └── exception/
│       │   │       ├── ExpenseNotFoundException.java
│       │   │       ├── ErrorResponse.java
│       │   │       └── GlobalExceptionHandler.java
│       │   └── resources/
│       │       ├── application.properties          # MySQL configuration
│       │       └── application-h2.properties       # Standalone testing profile
│       └── test/
│           ├── java/com/expensetracker/
│           │   ├── ExpenseServiceTest.java         # 9 unit tests
│           │   ├── ExpenseControllerTest.java      # 8 MockMvc tests
│           │   └── ExpenseTrackerApplicationTests.java
│           └── resources/
│               └── application.properties          # Test DB configuration
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx                                 # Routes definition
│       ├── main.jsx                                # Entry point
│       ├── index.css                               # Responsive UI styling
│       ├── services/
│       │   └── expenseService.js                   # Axios HTTP client
│       ├── components/
│       │   ├── Navbar.jsx                          # Top navigation
│       │   ├── CategoryBadge.jsx                   # Color-coded badges
│       │   └── ExpenseChart.jsx                    # Visual bar chart
│       └── pages/
│           ├── Dashboard.jsx                       # KPI cards & chart
│           ├── ExpenseList.jsx                     # Table, filter & actions
│           ├── AddExpense.jsx                      # Form with validation
│           └── EditExpense.jsx                     # Pre-populated edit form
├── .gitignore
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
* Java JDK 17 or higher (`java -version`)
* Node.js v18 or higher & npm (`node -v`, `npm -v`)
* MySQL Server (optional, built-in H2 profile also available)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/asmit-thakur/expense-tracker.git
cd expense-tracker
```

---

### Step 2: Run the Backend

#### Option A: Running with MySQL (Standard)
1. Open MySQL and create the database:
   ```sql
   CREATE DATABASE expensetracker_db;
   ```
2. Open `backend/src/main/resources/application.properties` and verify your username and password:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/expensetracker_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
3. Start the Spring Boot backend using the Maven wrapper:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   *(On Windows PowerShell, use `.\mvnw.cmd spring-boot:run`)*

#### Option B: Running with In-Memory H2 (Zero Configuration)
If you don't have MySQL installed or want to quickly test the project:
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```
*(On Windows PowerShell: `.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"`)*

Backend will start at **`http://localhost:8080`**.

#### Run Backend Tests:
```bash
cd backend
./mvnw test
```

---

### Step 3: Run the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:5173`** in your browser.

---


