### README for JungleShop

---

# JungleShop

**JungleShop** is a full-stack e-commerce web application built to simulate a modern online shopping platform. It provides a user-friendly interface for shoppers to browse products, add them to their cart, and complete purchases, while also offering a robust admin panel for managing product listings and bulk uploads.

---

## Features

### Shopper Features
1. **Homepage**: A welcoming landing page highlighting top-selling products.
2. **Category Selection**: Allows users to browse products by category with visually appealing category cards.
3. **Product Listings**: Displays product details like name, description, price, and image with a responsive design.
4. **Product Details Page**: View detailed information about a product and add it to the cart.
5. **Shopping Cart**:
   - Add, update, and remove items from the cart.
   - Displays subtotal, tax, delivery fee, and total cost.
   - Checkout functionality with a success message.
6. **Authentication**:
   - User Sign-Up (Shopper or Admin roles).
   - User Sign-In with personalized greetings.

### Admin Features
1. **Product Management**:
   - View a list of all products with the ability to edit or delete them.
   - Add individual products with required details like name, price, description, category, and image URL.
2. **Bulk Upload**:
   - Upload multiple products using a JSON or TXT file.
   - Validate and insert data into the database seamlessly.
3. **User-Friendly Interface**:
   - Clean and responsive admin dashboard.
   - Optimized for easy navigation and management.

---

## Technologies Used

### Frontend
- **HTML, CSS, JavaScript**
- Responsive design with **CSS Grid** and **Flexbox**.

### Backend
- **Node.js** with **Express.js** framework.
- **Multer** for file uploads.
- RESTful API design.

### Database
- **SQLite3** for storing user, product, and cart data.

---

---

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/jungle-shop.git
   cd jungle-shop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database:
   ```bash
   sqlite3 ./databases/jungle.db < ./databases/create_tables.sql
   ```

4. Start the server:
   ```bash
   node app.js
   ```

5. Access the application in your browser at:
   ```
   http://localhost:4000
   ```

---

## Future Enhancements

- Implement advanced search filters.
- Add payment gateway integration for checkout.
- Introduce user account management features.
- Add functionality for tracking order history.

---

Feel free to adjust or expand on this description depending on your project's scope or any additional features you have implemented.
