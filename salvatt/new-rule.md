You are an expert full-stack developer specializing in Angular for the frontend and a Node.js/Express/Prisma backend. Your next task is to implement user authentication, admin authorization, and redesign the product management UI for my e-commerce application.

Based on the existing application, please perform the following tasks:

1. Create a Dedicated Login and Authentication Flow:

    Create a new, dedicated page at the /login route.

    This page must include two authentication methods:

        A standard form with "Email" and "Password" fields.

        A prominent "Login with Google" button to handle OAuth authentication.

    Upon successful login, the application should store the user's session token (e.g., a JWT) and redirect them to the homepage.

2. Implement Admin-Only Authorization for Products:

    The backend is already configured to only allow users with the ADMIN role to create, update, or delete products.

    Implement role-based access control on the Angular frontend.

    Create an Angular route guard to protect all admin-related pages. Non-admin users who try to access these URLs directly should be redirected away (e.g., to the homepage or a "403 Forbidden" page).

    All UI elements for managing products (like "Add Product" buttons or links) must be hidden from users who are not logged in as an ADMIN.

3. Create a Dedicated "Add Product" Page:

    Create a new, admin-only page at the /admin/add-product route.

    Move the entire "Adicionar Produto" form (which is currently on the homepage in the provided screenshot) to this new /admin/add-product page.

4. Redesign the Homepage Layout:

    Remove the "Adicionar Produto" form completely from the main view of the homepage (localhost:4200).

    In the space where the form was, implement a component that fetches products from the backend API.

    Display these products in a responsive grid layout using visually appealing product cards.

    Each product card should at a minimum display the product's image, name, and price.

Please ensure the code follows modern Angular best practices, is well-structured, and the new pages match the existing visual style of the application.