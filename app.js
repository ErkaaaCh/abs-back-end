const express = require("express");
const app = express();
const { Client } = require("pg");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
