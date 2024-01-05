const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Connection configuration for MySQL Workbench
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sanjay@123",
  database: "nodetest",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware to parse JSON requests
router.use(express.json());

// Update Order API route
router.put("/update", async (req, res) => {
  try {
    // Validate request body
    const { order_id, order_name } = req.body;
    if (!order_id || !order_name) {
      return res
        .status(400)
        .json({ error: "Invalid request. Missing required fields." });
    }

    // Update the order name in the order_header table
    const [updateResult] = await db.execute(
      "UPDATE order_header SET order_name = ? WHERE order_id = ?",
      [order_name, order_id]
    );
    console.log(updateResult);
    // Check if the order was found and updated
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Retrieve the updated order details
    const [updatedOrder] = await db.execute(
      "SELECT * FROM order_header WHERE order_id = ?",
      [order_id]
    );

    // Return the updated order details in the response
    res.status(200).json(updatedOrder[0]);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
