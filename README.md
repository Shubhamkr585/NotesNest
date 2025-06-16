# Notes Selling Platform (v1)

## Overview

The Notes Selling Platform is a web application built using the MERN stack (MongoDB, Express.js, React, Node.js) to enable toppers of competitive exams, initially JEE (Main and Advanced) and UPSC, to sell their study notes to buyers. The platform aims to provide a seamless experience for sellers to upload notes and buyers to browse, view, and purchase them.

This project is in its initial setup phase and will eventually include features like free first-time note viewing, advertisement-based subsequent views, secure payments via Razorpay, and exclusive access to toppers’ short tricks and guides.


---

## Current Status

- **Backend:** Set up with Express.js, MongoDB (via Mongoose), and basic API routes.
- **Frontend:** Initialized with Vite (React), including JSX components and routing via React Router.
- **Dependencies:** Installed necessary packages for both backend and frontend.

---

## Tech Stack

- **Frontend:** React.js (Vite, JSX), React Router, Axios
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB (local or MongoDB Atlas)
- **Build Tool:** Vite (frontend)

**Planned Integrations:**
- Razorpay (for payments)
- Cloudinary (for file storage)
- JWT (for authentication)

---

## Folder Structure

```
notes-selling-platform/
├── backend/
│   ├── db/                   # Database configuration
│   │   └── connection.js
│   ├── controllers/              # Request handling logic
│   │   ├── authController.js
│   │   ├── notesController.js
│   │   └── orderController.js
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Note.js
│   │   ├── ViewHistory.js
│   │   └── Order.js
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js
│   │   ├── notesRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/               # Authentication middleware
│   │   └── authMiddleware.js
│   ├── utils/                    # Utility functions (e.g., Razorpay)
│   │   └── razorpay.js
│   └── server.js                 # Backend entry point
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── NotesList.js
│   │   │   ├── NoteViewer.js
│   │   │   └── Checkout.js
│   │   ├── pages/                # Page-level components
│   │   │   ├── Home.js
│   │   │   └── BuyerDashboard.js
│   │   ├── services/             # API call functions
│   │   │   └── api.js
│   │   ├── App.js                # Main app with routing
│   │   ├── index.js              # React entry point
│   │   ├── index.css             # Global styles
│   ├── vite.config.js            # Vite configuration
├── .env                          # Environment variables
└── README.md                     # Project documentation
```

---

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Razorpay account (for future payment integration)
- AWS S3 account (optional, for future file storage)

---

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
    ```sh
    cd backend
    ```
2. Initialize the project (if not already done):
    ```sh
    npm init -y
    ```
3. Install dependencies:
    ```sh
    npm install express mongoose dotenv jsonwebtoken bcryptjs razorpay pdf-lib
    ```
4. Create a `.env` file in the backend folder with:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    PORT=5000
    ```
5. Start the backend server:
    ```sh
    node server.js
    ```

### Frontend Setup

1. Navigate to the frontend folder:
    ```sh
    cd frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
    > Vite includes react, react-dom, and @vitejs/plugin-react. Additional dependencies (axios, react-router-dom) are installed.
3. Create a `.env` file in the frontend folder with:
    ```
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    ```
4. Add the Razorpay SDK to `frontend/public/index.html`:
    ```html
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    ```
5. Start the frontend development server:
    ```sh
    npm run dev
    ```

### Database Setup

- Set up a MongoDB database (local or MongoDB Atlas).
- Update `MONGO_URI` in the backend `.env` file with your connection string.

---

## Running the Application

- **Start the backend:**
    ```sh
    cd backend && node server.js
    ```
    Runs at [http://localhost:5000](http://localhost:5000).

- **Start the frontend:**
    ```sh
    cd frontend && npm run dev
    ```
    Runs at [http://localhost:5173](http://localhost:5173) (default Vite port).

- Access the app at [http://localhost:5173](http://localhost:5173) in your browser.

---

## Planned Features

- **Authentication:** JWT-based user registration and login for buyers, sellers, and admins.
- **Note Viewing:**
    - Free first view of notes.
    - Advertisement-based subsequent views.
    - Payment required for downloading notes.
- **Payments:** Secure note purchases via Razorpay.
- **Exclusive Content:** Access to toppers’ short tricks and guides for paid buyers.
- **Reselling Protection:** Watermarking notes and Terms of Service to prevent unauthorized reselling.

---

## Notes

- **Current State:** The project is set up with basic structure and dependencies. Functionality like note viewing, payments, and ads will be implemented next.
- **Environment Variables:** Ensure `.env` files are configured correctly for MongoDB and Razorpay.
---

## Contributing

Contributions are welcome! Please open an issue to discuss proposed changes.

---

## License

This project is licensed under the MIT License.
