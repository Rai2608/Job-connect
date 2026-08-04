# JobConnect

A full-stack job portal built on the **MEAN** stack (MongoDB, Express, Angular, Node.js) supporting three roles: **Candidates**, **Companies/Interviewers**, and **Admins**.


---

## ✨ Features

- **Candidates**: profile & resume management, job search/filters, apply to jobs, application tracking, saved jobs, notifications
- **Companies**: company profile with admin verification, job posting CRUD, applicant management, status pipeline, interview scheduling
- **Admins**: company verification queue, user management, job moderation, skills/category taxonomy, platform dashboard
- JWT-based authentication with role-based access control (RBAC)
- Email notifications (verification, application updates, interview invites)
- Responsive UI (mobile/tablet/desktop)

## 🏗️ Architecture

```
┌─────────────────┐        REST API (JWT)        ┌──────────────────┐
│   Angular SPA    │ ───────────────────────────► │  Express.js API   │
│  (client/)        │ ◄─────────────────────────── │   (server/)        │
└─────────────────┘                              └────────┬─────────┘
                                                            │
                                                   ┌────────▼─────────┐
                                                   │     MongoDB       │
                                                   │   (Mongoose)      │
                                                   └────────────────────┘
                                          also connects to:
                                  Cloudinary/S3 (files) · SMTP (email)
```

## 🛠️ Tech Stack

Frontend: **Angular 18**, TypeScript, RxJS, Angular Material/Tailwind
Backend: **Node.js 20**, **Express.js**, **MongoDB**, **Mongoose**
Auth: JWT (access + refresh), bcrypt
Storage: Cloudinary/S3 · Email: Nodemailer

Full details in [`TECH_STACK.md`](./TECH_STACK.md).

## 📁 Project Structure

```
job-portal/
├── client/              # Angular frontend
├── server/              # Express backend
├── docs/                # PRD, requirements, API docs
├── docker-compose.yml
├── README.md
├── PRD.md
├── requirements.md
└── TECH_STACK.md
```

## ✅ Prerequisites

- Node.js ≥ 20.x and npm ≥ 10.x
- MongoDB ≥ 7.x (local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- Angular CLI: `npm install -g @angular/cli`
- (Optional) Docker & Docker Compose
- A Cloudinary or AWS S3 account (for file uploads)
- An SMTP provider (SendGrid, Mailgun, or Gmail app password for dev)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-org>/job-portal.git
cd job-portal
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env   # then fill in the values below
npm run dev             # starts on http://localhost:5000
```

**`server/.env`**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/jobconnect
JWT_ACCESS_SECRET=replace_with_strong_secret
JWT_REFRESH_SECRET=replace_with_strong_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:4200
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=xxxx
EMAIL_FROM=noreply@jobconnect.com
```

### 3. Frontend setup
```bash
cd client
npm install
ng serve                # starts on http://localhost:4200
```

**`client/src/environments/environment.ts`**
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/v1'
};
```

### 4. Run with Docker (alternative)
```bash
docker-compose up --build
```
This spins up MongoDB, the Express API, and the Angular app together.

## 👤 Seeding an Admin Account

Since admins are not self-registerable, seed one manually:
```bash
cd server
npm run seed:admin -- --email admin@jobconnect.com --password ChangeMe123!
```

## 🧪 Testing

```bash
# Backend unit tests
cd server && npm test

# Frontend unit tests
cd client && npm test

# End-to-end tests
cd client && npm run e2e
```

## 📚 API Documentation

Once the backend is running, Swagger docs are available at:
```
http://localhost:5000/api/docs
```

## 🔑 Default Roles & Access

| Role | Signup | Access |
|---|---|---|
| `candidate` | Self-registration | `/candidate/**` routes |
| `company` | Self-registration (requires admin verification before posting jobs) | `/company/**` routes |
| `admin` | Seeded/invited only | `/admin/**` routes |

## 📦 Build for Production

```bash
# Frontend
cd client
ng build --configuration production

# Backend
cd server
npm run build   # if using TypeScript, else just deploy src/ directly
npm start
```

## 🤝 Contributing

1. Fork the repo and create a feature branch: `git checkout -b feature/your-feature`
2. Follow the ESLint/Prettier rules (`npm run lint`)
3. Write/update tests for your change
4. Open a pull request with a clear description

## 📄 License

MIT — see `LICENSE` file.

---

For product scope, see [`PRD.md`](./PRD.md).
For detailed requirements, see [`requirements.md`](./requirements.md).
For the full tech stack rationale, see [`TECH_STACK.md`](./TECH_STACK.md).
