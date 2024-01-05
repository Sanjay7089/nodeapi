const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8000;

// imports
const personRoutes = require("./routes/personRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderItemsRoute = require("./routes/orderItems");
const getOrdersRoute = require("./routes/getOrders");
const getOrderRoutes = require("./routes/getOrderController");
const updateOrderRoutes = require("./routes/updateOrder");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cross origin resourse sharing cors error resolution
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PATCH,DELETE",
  })
);
// connection config with mysql workbench
const db = mysql.createConnection({
  host: "localHost",
  user: "root",
  password: "Sanjay@123",
  database: "nodetest",
});
//! routes -->

app.use("/api/person", personRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/orderItems", orderItemsRoute);
app.use("/api/orders", getOrdersRoute);
app.use("/api/getOrder", getOrderRoutes);
app.use("/api/order", updateOrderRoutes);
// workbench connection

db.connect(function (err) {
  if (err) {
    console.log(err + "error occurred while connecting");
  } else {
    console.log("connection created with Mysql successfully");
  }
});

app.listen(PORT, () =>
  console.log(`Your server is running successfully on PORT ${PORT}`)
);
