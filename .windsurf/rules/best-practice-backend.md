---
trigger: always_on
---

You are an expert backend developer specializing in building scalable and secure e-commerce APIs using modern best practices.

 "Throughout the code, add detailed comments explaining the purpose of complex functions, middleware, and business logic decisions."

Your task is to create a complete backend for an e-commerce website using **Node.js, Express.js, TypeScript, and Prisma**.

**1. Database Schema:**
Use the following Prisma schema as the foundation for the database models.

```prisma
// PASTE YOUR PROVIDED PRISMA SCHEMA HERE
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(CUSTOMER)
  orders    Order[]
  cart      Cart?
  reviews   Review[]
}

model Product {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  name        String
  description String?
  price       Float
  imageUrl    String?
  stock       Int      @default(0)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  cartItems   CartItem[]
  reviews     Review[]
}

model Category {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  name      String   @unique
  products  Product[]
}

model Order {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  total     Float
  status    OrderStatus @default(PENDING)
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  items     OrderItem[]
}

model OrderItem {
  id        String @id @default(uuid())
  quantity  Int
  price     Float
  orderId   String
  productId String
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
  @@unique([orderId, productId])
}

model Cart {
  id        String @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String @unique
  user      User      @relation(fields: [userId], references: [id])
  items     CartItem[]
}

model CartItem {
  id        String @id @default(uuid())
  quantity  Int    @default(1)
  cartId    String
  productId String
  cart      Cart    @relation(fields: [cartId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
  @@unique([cartId, productId])
}

model Review {
  id        String @id @default(uuid())
  createdAt DateTime @default(now())
  rating    Int
  comment   String?
  userId    String
  productId String
  user      User    @relation(fields: [userId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
  @@unique([userId, productId])
}

enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

2. Core Features & API Endpoints:
Implement the following RESTful API endpoints. Ensure proper status codes are used for all responses.

    Authentication (using JWT):

        POST /api/auth/register: Register a new user (name, email, password).

        POST /api/auth/login: Log in a user and return a JWT.

        GET /api/auth/me: (Protected) Get the profile of the currently logged-in user.

    Products (Public & Admin):

        GET /api/products: List all products. Implement pagination (page, limit) and filtering (categoryId).

        GET /api/products/:id: Get a single product by its ID.

        POST /api/products: (Admin only) Create a new product.

        PUT /api/products/:id: (Admin only) Update an existing product.

        DELETE /api/products/:id: (Admin only) Delete a product.

    Categories (Public & Admin):

        GET /api/categories: List all categories.

        POST /api/categories: (Admin only) Create a new category.

        PUT /api/categories/:id: (Admin only) Update a category.

    Cart (User specific, protected):

        GET /api/cart: Get the current user's cart.

        POST /api/cart/items: Add an item to the cart (productId, quantity).

        PUT /api/cart/items/:productId: Update the quantity of an item in the cart.

        DELETE /api/cart/items/:productId: Remove an item from the cart.

    Orders (User & Admin, protected):

        POST /api/orders: Create a new order from the user's current cart.

        GET /api/orders: Get order history (for the current user if role is CUSTOMER, or all orders if role is ADMIN).

        GET /api/orders/:id: Get a specific order's details.

        PUT /api/orders/:id/status: (Admin only) Update the status of an order.

    Reviews (User specific, protected):

        POST /api/reviews: Create a review for a product (productId, rating, comment). A user should only be able to review a product they have purchased.

3. Architecture & Best Practices:
Implement the following architectural patterns and best practices:

    Project Structure: Organize the code into a scalable, modular structure. For example:

        src/api/routes

        src/api/controllers

        src/api/services (for business logic)

        src/middlewares

        src/config

        src/utils

    Security:

        Hash user passwords using bcrypt before saving to the database.

        Implement authentication middleware using JSON Web Tokens (JWT) to protect routes.

        Implement authorization middleware (isAdmin) to restrict access to admin-only endpoints based on the user's role.

    Validation:

        Use Zod to validate all incoming request bodies, query parameters, and path parameters to ensure data integrity.

    Error Handling:

        Create a global error handling middleware to catch and format all errors consistently, sending back meaningful error messages and status codes.

    Environment Variables:

        Use a .env file for all sensitive information and environment-specific configurations (DATABASE_URL, JWT_SECRET, PORT). Use the dotenv package.

4. Output Format:
Please provide the complete and runnable code for all necessary files. Present the output in a structured way:

    List the required dependencies for package.json.

    Provide the content for tsconfig.json.

    For each source code file, use a markdown code block and add a comment at the top indicating its full file path (e.g., // src/server.ts).

Start by setting up the main server.ts file.

5. For Testing: "Now, write unit and integration tests for the services and controllers using Jest and Supertest."

6.For API Documentation: "Generate an OpenAPI 3.0 (Swagger) specification for all the API endpoints you created."

7. "Please configure the Express app to use the cors middleware to allow requests from my frontend application."

---
### Why This Prompt Works Well

* **Sets a Persona:** It tells the LLM to act like an expert, which primes it to produce higher-quality, professional code.
* **Provides Full Context:** It includes the *exact* Prisma schema, removing any guesswork for the AI.
* **Defines Clear Requirements:** It lists the specific API endpoints, HTTP methods, and functionality (like pagination or role-based access), creating a precise checklist for the LLM.
* **Enforces Best Practices:** By demanding things like Zod for validation, bcrypt for hashing, JWT for auth, and a specific project structure, you ensure the generated code isn't just functional but also secure, scalable, and maintainable.
* **Specifies Output Format:** This instruction ensures the AI provides the code in an organized, easy-to-copy-and-paste format with clear file paths.