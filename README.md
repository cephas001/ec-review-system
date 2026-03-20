# Excellence Conference Payment Review System

A full-stack, responsive web application designed to streamline the payment verification process for the Excellence Conference 2026. This system allows authorized reviewers to seamlessly validate attendee payments for merchandise and the Workers Dinner, cross-reference Google Sheets data, and manage approval workflows.

## 🚀 Features

- **Centralized Dashboard:** A single, unified view of all pending, approved, and rejected submissions.
- **Smart Receipt Viewer:** Side-by-side verification with an interactive carousel for users who paid in installments (multiple receipts).
- **Real-time Status Updates:** Direct integration with Google Sheets to update applicant statuses instantly.
- **Role-Based Access Control:** Secure authentication for reviewers to ensure data integrity and privacy.
- **Abstracted Workflows:** Clean separation of concerns where final approved lists are automatically isolated from the review queue.

## 🛠️ Tech Stack

**Frontend:**

- [Nuxt.js](https://nuxt.com/) - Vue framework for a robust, SSR-ready user interface.
- UI Library (Tailwind / Nuxt UI) - For clean, responsive, and professional styling.

**Backend:**

- [Express.js](https://expressjs.com/) - Node.js web application framework handling API requests.
- [PostgreSQL](https://www.postgresql.org/) - Relational database for managing reviewer authentication and sessions.
- Google Sheets API - Acting as the primary data source and write-destination for applicant records.
- Google Drive API - Secure proxying of user-uploaded receipt files.

**Deployment:**

- **Frontend:** Vercel
- **Backend:** Render / Railway (Planned)

## 📦 Project Structure

This is a monorepo containing both the frontend and backend applications:

```text
ec-review-system/
├── frontend/       # Nuxt.js application
├── backend/        # Express.js API & Database logic
├── .gitignore      # Root git ignore
└── README.md       # Project documentation
```
