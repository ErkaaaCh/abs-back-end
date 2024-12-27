const pool = require("../db/db");
const bcrypt = require("bcryptjs");

exports.create = async (req, res) => {
  try {
    const { firstname, lastname, email, password, phone , address } = req.body;
    if ((!firstname || !lastname || !address || !email || !password, !phone)) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const emailCheckQuery = "SELECT * FROM customers WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);
    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Email is already in use" });
    }
    const phoneCheck = "SELECT * FROM customers WHERE phone = $1";
    const phoneCheckResult = await pool.query(phoneCheck, [phone]);
    if (phoneCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Phone is already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `
        INSERT INTO customers (firstname, lastname, address, email, password, phone)
        VALUES ($1, $2, $3, $4, $5 , $6)
        RETURNING *;
      `;
    const result = await pool.query(insertQuery, [
      firstname,
      lastname,
      address,
      email,
      hashedPassword,
      phone,
    ]);
    const newUser = result.rows[0];
    return res.status(201).json({
      message: "Created successful",
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const result = await pool.query('SELECT * FROM customers WHERE phone = $1', [phone]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const customer = result.rows[0];
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.status(200).json({
            message: "Login successful",
            customerId: customer.id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.all = async (req, res) => {
  try {
    const query = "SELECT * FROM customers";
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
};