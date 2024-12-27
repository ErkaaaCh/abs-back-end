const express = require("express");
const app = express();
const cors = require('cors'); 
require("dotenv").config();

app.use(express.json());
app.use(cors());

const userRoutes = require("./src/routes/user.route");

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/users" , userRoutes);

const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
