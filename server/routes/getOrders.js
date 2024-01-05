// routes/getOrders.js
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

// API route for getting all orders
router.get("/", async (req, res) => {
  try {
    // Fetch all orders from the database
    const ordersResult = await query("SELECT * FROM order_header");
    console.log(ordersResult);

    // Format the response according to the specified schema
    const orders = [];
    for (const order of ordersResult) {
      const orderItemsResult = await query(
        "SELECT * FROM order_item WHERE order_id = ?",
        [order.order_id]
      );

      const orderItems = orderItemsResult.map((item) => ({
        order_item_seq_id: item.order_item_seq_id,
        product_id: item.product_id,
        item_description: item.item_description,
        quantity: item.quantity,
        unit_amount: item.unit_amount,
        item_type_enum_id: item.item_type_enum_id,
      }));

      orders.push({
        order_id: order.order_id,
        order_name: order.order_name,
        placed_date: order.placed_date,
        approved_date: order.approved_date,
        status_id: order.status_id,
        party_id: order.party_id,
        currency_uom_id: order.currency_uom_id,
        product_store_id: order.product_store_id,
        sales_channel_enum_id: order.sales_channel_enum_id,
        grand_total: order.grand_total,
        completed_date: order.completed_date,
        order_items: orderItems,
      });
    }

    // Return the formatted orders in the response
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
