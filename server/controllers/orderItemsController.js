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

// Function to add order items
const addOrderItems = async (orderData) => {
  try {
    // Start a transaction
    db.beginTransaction();

    // Example: Insert order information into the orders table
    const [orderResult] = await query(
      'INSERT INTO order_header (order_id, placed_date, status_id, party_id, currency_uom_id) VALUES (?, NOW(), ?, ?, ?)',
      [orderData.order_id, 'OrderPlaced', orderData.party_id, orderData.currency_uom_id]
    );

    const orderId = orderResult.insertId;

    // Example: Insert order items into the order_item table
    for (const item of orderData.order_items) {
      await query(
        'INSERT INTO order_item (order_id, order_item_seq_id, product_id, item_description, quantity, unit_amount, item_type_enum_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [orderId, item.order_item_seq_id, item.product_id, item.item_description, item.quantity, item.unit_amount, item.item_type_enum_id]
      );
    }

    // Commit the transaction
    db.commit();

    // Return orderId and orderPartSeqId
    return { orderId, orderPartSeqId: 'your_generated_order_part_seq_id' };
  } catch (error) {
    // Rollback the transaction on error
    db.rollback();
    throw error;
  }
};

// API route for adding order items
router.post("/add", async (req, res) => {
  try {
    // Validate request body
    const { order_id, order_items } = req.body;
    if (!order_id || !order_items || !Array.isArray(order_items) || order_items.length === 0) {
      return res.status(400).json({ error: 'Invalid request. Missing required fields.' });
    }

    // Call the function to add order items
    const result = await addOrderItems(req.body);

    // Return the result in the response
    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding order items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
