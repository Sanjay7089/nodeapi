const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const util = require("util");

// Connection configuration for MySQL Workbench
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sanjay@123",
  database: "nodetest",
});

// Convert callback-style functions to promise-style
const query = util.promisify(db.query).bind(db);

// Function to get an order by its order ID
const getOrderById = async (orderId) => {
  try {
    // Fetch order information along with items based on order_id
    const [orderData] = await query(
      `SELECT * FROM order_header 
       LEFT JOIN order_item ON order_header.order_id = order_item.order_id 
       WHERE order_header.order_id = ?`,
      [orderId]
    );

    return orderData;
  } catch (error) {
    throw error;
  }
};

// API route for getting an order by its order ID
router.get("/:orderId", async (req, res) => {
  try {
    // Get the order ID from the request parameters
    const { orderId } = req.params;

    // Validate that orderId is provided
    if (!orderId) {
      return res
        .status(400)
        .json({ error: "Invalid request. Missing order ID." });
    }

    // Call the function to get an order by its ID
    const orderData = await getOrderById(orderId);

    // Send the response
    res.status(200).json({ orders: orderData });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
