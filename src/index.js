//Importar bibliotecas
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { count } = require('console');
const mysql = require("mysql2/promise");

async function getConnection() {
  const connectionData = {
    host: process.env ["MYSQL_HOST"],
    port: process.env ["MYSQL_PORT"],
    user: process.env ["MYSQL_USER"],
    password: process.env ["MYSQL_PASS"],
    database: process.env ["MYSQL_SCHEMA"],
  };
  console.log(connectionData);
  
  const connection = await mysql.createConnection(connectionData);
  await connection.connect();
  return connection;
};

//Configuración del servidor
const app = express();
app.use(cors());
app.use(express.json());

//Arranque del servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port <http://localhost:${port}>`);
});

//Primer endpoint, petición GET 
app.get('/libros', async (req, res) => {

  const conn = await getConnection();

  const [results] = await conn.query (`SELECT * FROM libros;`);
  
  await conn.end();

  const numOfElements = results.length;

  res.json({
    info: { count: numOfElements }, //número de elementos
    results: results, //listado
  });
});
