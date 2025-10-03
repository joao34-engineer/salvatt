# Salvatt E-commerce Platform

## Project Structure

This is a modern e-commerce platform built with Angular (frontend) and Node.js/Express/Prisma (backend).

### Main Directories:
- `backend/` - Node.js API server with Express and Prisma
- `salvatt/` - Angular frontend application

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
Create a `.env` file with:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/salvatt"
JWT_SECRET="your-secret-key"
PORT=3001
CORS_ORIGIN="http://localhost:4200"
FRONTEND_URL="http://localhost:4200"
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. Seed admin user (optional):
```bash
npm run seed:admin
```

6. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd salvatt
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Open browser at `http://localhost:4200`

## Default Admin Credentials

If you ran the seed script:
- Email: admin@salvatt.com
- Password: admin123

## Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm start` - Start dev server
- `npm run build` - Build for production
- `npm test` - Run tests

## Features

- User authentication (JWT)
- Product management (CRUD)
- Category management
- Admin dashboard
- Responsive design
- PostgreSQL database
- Type-safe with TypeScript

## Tech Stack

### Backend
- Node.js & Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod validation

### Frontend
- Angular 20
- TypeScript
- Signals for state management
- Standalone components
- Reactive forms

## License

MIT
