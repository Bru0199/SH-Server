import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Welcome to StillHungry Backend API</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #fafafa; color: #222; }
          h1 { color: #d35400; }
          ul { line-height: 1.7; }
          .note { margin-top: 20px; color: #888; font-size: 0.95em; }
        </style>
      </head>
      <body>
        <h1>Welcome to the StillHungry Backend API!</h1>
        <p><strong>About:</strong> StillHungry is a backend service for a food ordering platform. It provides RESTful APIs for user authentication, menu management, order processing, reviews, coupons, payments, and more.</p>
        <h2>Available APIs</h2>
        <ul>
          <li><b>/api/auth</b> - User authentication and password management</li>
          <li><b>/api/menu</b> - Menu and item management</li>
          <li><b>/api/orders</b> - Order creation and tracking</li>
          <li><b>/api/users</b> - User profile and management</li>
          <li><b>/api/reviews</b> - User reviews for menu items</li>
          <li><b>/api/coupons</b> - Coupon and discount management</li>
          <li><b>/api/addons</b> - Addon items for menu</li>
          <li><b>/api/categories</b> - Menu category management</li>
          <li><b>/api/admin</b> - Admin operations</li>
          <li><b>/api/payment</b> - Payment processing</li>
        </ul>
      </body>
    </html>
  `);
});

export default router;
