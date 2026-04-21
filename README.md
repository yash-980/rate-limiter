# Rate Limit SaaS Frontend

This is the Next.js dashboard for the Rate Limit SaaS MVP.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
copy .env.example .env.local
```

3. Make sure the backend is running at:

```txt
http://localhost:5000
```

4. Start the frontend:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Page Flow

1. Signup or login.
2. Go to dashboard.
3. Create a project.
4. Open the project details page.
5. Create an API key.
6. Create a rate limit rule.
7. Call the backend `/api/check-limit` endpoint using Postman.
8. Refresh logs in the project details page.
