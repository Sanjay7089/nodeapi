const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connection config with MySQL Workbench
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sanjay@123",
  database: "nodetest",
});

router.post("/create", (req, res) => {
  const {
    order_name,
    placed_date,
    approved_date,
    status_id = "OrderPlaced",
    party_id,
    currency_uom_id = "USD",
    product_store_id,
    sales_channel_enum_id,
    grand_total,
    completed_date,
  } = req.body;

  const sql =
    "INSERT INTO order_header (order_id, order_name, placed_date, approved_date, status_id, party_id, currency_uom_id, product_store_id, sales_channel_enum_id, grand_total, completed_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    // Provide a value for order_id, or generate one programmatically
    // You can use a library like 'uuid' to generate a unique identifier
    "ORD100",
    order_name,
    placed_date,
    approved_date,
    status_id,
    party_id,
    currency_uom_id,
    product_store_id,
    sales_channel_enum_id,
    grand_total,
    completed_date,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating order: ", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const orderId = result.insertId;
      console.log(`Order created successfully with orderId: ${orderId}`);
      res.status(201).json({ orderId });
    }
  });
});

module.exports = router;
