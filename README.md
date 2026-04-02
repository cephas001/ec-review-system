> ⚠️ **DEPRECATION NOTICE: MOVED TO MONOREPO**
>
> This standalone repository has been archived and is now read-only.
>
> The Excellence Conference Review System has been successfully integrated as an administrative module within the main conference ecosystem. **All active development, issues, and deployments are now managed in the central monorepo:**
>
> 👉 **[hhttps://excellence-conference-website-admin.vercel.app/]**
>
> _Historical context: Prior to deprecation, this system's authentication and database layers were migrated from PostgreSQL/Custom JWTs to a serverless Firebase architecture (Auth + Firestore)._

---

# Excellence Conference Payment Review System (Archived)

A full-stack, responsive web application designed to streamline the payment verification process for the Excellence Conference 2026. This system allows authorized reviewers to seamlessly validate attendee payments for merchandise and the Workers Dinner, cross-reference Google Sheets data, and manage approval workflows.

## 🚀 Features

- **Centralized Dashboard:** A single, unified view of all pending, approved, and rejected submissions.
- **Smart Receipt Viewer:** Side-by-side verification with an interactive carousel for users who paid in installments (multiple receipts).
- **Real-time Status Updates:** Direct integration with Google Sheets to update applicant statuses instantly.
- **Role-Based Access Control:** Secure, custom-claim authentication for reviewers to ensure data integrity and privacy.
- **Abstracted Workflows:** Clean separation of concerns where final approved lists are automatically isolated from the review queue.

## 🛠️ Final Tech Stack (Pre-Merge)

**Frontend:**

- [Nuxt.js](https://nuxt.com/) - Vue framework for a robust, SSR-ready user interface.
- UI Library (Tailwind / Nuxt UI) - For clean, responsive, and professional styling.
- Firebase Client SDK - Handling frontend authentication flows.

**Backend:**

- [Express.js](https://expressjs.com/) - Node.js web application framework handling API requests.
- Firebase Admin SDK - Server-side authentication verification and role management.
- Google Cloud Firestore - NoSQL document database for reviewer metadata and session tracking.
- Google Sheets API - Acting as the primary data source and write-destination for applicant records.
- Google Drive API - Secure proxying of user-uploaded receipt files.

## 📦 Project Structure (Historical)

Prior to the monorepo merge, the folder structure was isolated as follows:

```text
ec-review-system/
├── frontend/       # Nuxt.js client application
├── backend/        # Express.js API & Firebase logic
├── .gitignore      
└── README.md
```
