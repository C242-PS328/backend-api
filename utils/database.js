const mysql = require("mysql2/promise");

// Membuat koneksi ke database menggunakan connection pool
const connection = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "tanamore_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;
