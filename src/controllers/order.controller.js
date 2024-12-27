const pool = require("../db/db");

exports.create = async (req, res) => {
  try {
    const { userId, customerId, serviceId } = req.body;
    if (!userId || !customerId || !serviceId) {
      return res.status(404).json({ message: "Insert all fields" });
    }
    const query = `
        INSERT INTO orders (user_id, customer_id, service_id, status)
        VALUES ($1, $2, $3,  'pending') RETURNING *;
      `;

    const values = [userId, customerId, serviceId];
    const result = await pool.query(query, values);

    return res.status(201).json({
      message: "Order created successfully",
      order: result.rows[0],
    });
  } catch (err) {
    console.log(err);
  }
};

exports.all = async (req, res) => {
  try {
    const query = `
        SELECT 
          o.id AS order_id,
          o.status,
          o.created_at,
          u.firstname AS user_firstname,
          u.lastname AS user_lastname,
          u.email AS user_email,
          u.phone AS user_phone,
          c.firstname AS customer_firstname,
          c.lastname AS customer_lastname,
          c.email AS customer_email,
          c.phone AS customer_phone,
          s.serviceName AS service_name,
          s.category AS service_category,
          s.price AS service_price
        FROM orders o
        JOIN users u ON u.id = o.user_id
        JOIN customers c ON c.id = o.customer_id
        JOIN services s ON s.id = o.service_id
        ORDER BY o.created_at DESC;
      `;
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders: result.rows,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving orders" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res
        .status(400)
        .json({ message: "Please provide both id and status" });
    }
    const validStatuses = ["pending", "completed", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }
    const checkOrderQuery = "SELECT * FROM orders WHERE id = $1";
    const checkOrderResult = await pool.query(checkOrderQuery, [id]);

    if (checkOrderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updateQuery = `
          UPDATE orders
          SET status = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          RETURNING *;
        `;
    const updateValues = [status, id];

    const result = await pool.query(updateQuery, updateValues);
    return res.status(200).json({
      message: "Order status updated successfully",
      order: result.rows[0],
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getByCustomer = async(req , res) => {
    try {
        const { customerId } = req.body;
        if (!customerId) {
            return res
              .status(400)
              .json({ message: "Please provide both id and status" });
          }
        const query = `
          SELECT * FROM orders
          WHERE customer_id = $1
        `  
        const foundOrders = await pool.query(query , [customerId]);
        return res.status(200).json(foundOrders.rows);
    } catch(err) {
        console.log(err);
    }
}
