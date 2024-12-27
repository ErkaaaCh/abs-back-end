const pool = require("../db/db");

exports.create = async (req, res) => {
  try {
    const {
      serviceName,
      category,
      description,
      serviceImage,
      duration,
      price,
    } = req.body;
    if (
      (!serviceName || !category || !description || !serviceImage || !duration,
      !price)
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const insertQuery = `
            INSERT INTO services (serviceName, category, description, serviceImage, duration, price)
            VALUES ($1, $2, $3, $4, $5 , $6)
            RETURNING *;
        `;
    const result = await pool.query(insertQuery, [
      serviceName,
      category,
      description,
      serviceImage,
      duration,
      price,
    ]);
    const newService = result.rows[0];
    return res.status(201).json({
      message: "Created successful",
      service: newService,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.all = async (req, res) => {
  try {
    const query = "SELECT * FROM services";
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error retrieving users:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      id,
      serviceName,
      description,
      price,
      category,
      duration,
      serviceImage,
    } = req.body;
    const query = `
        UPDATE services
        SET serviceName = $1, description = $2, price = $3 , category = $4 , serviceImage = $5 , duration = $6
        WHERE id = $7
        RETURNING *;  
      `;
    const result = await pool.query(query, [
      serviceName,
      description,
      price,
      category,
      serviceImage,
      duration,
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send({ message: "Not found" });
    }
    return res.status(200).json({ message: "Updated Successfully" });
  } catch (err) {
    console.error("Error updating service:", err);
    return res.status(500).send("Internal Server Error");
  }
};
