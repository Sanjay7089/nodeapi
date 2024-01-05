const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connection config with mysql workbench
const db = mysql.createConnection({
  host: "localHost",
  user: "root",
  password: "Sanjay@123",
  database: "nodetest",
});

// Route to create a person
router.post("/create", (req, res) => {
  const {
    party_id,
    first_name,
    middle_name,
    last_name,
    gender,
    birth_date,
    marital_status_enum_id,
    employment_status_enum_id,
    occupation,
  } = req.body;

  const sql =
    "INSERT INTO person (party_id, first_name, middle_name, last_name, gender, birth_date, marital_status_enum_id, employment_status_enum_id, occupation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    party_id,
    first_name,
    middle_name,
    last_name,
    gender,
    birth_date,
    marital_status_enum_id,
    employment_status_enum_id,
    occupation,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating person: ", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Person created successfully");
      res.status(201).json({ message: "Person created successfully" });
    }
  });
});

module.exports = router;
