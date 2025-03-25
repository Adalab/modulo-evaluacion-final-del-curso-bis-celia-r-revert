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

//Primer endpoint, petición GET con todos los resultados
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

//Segundo endpoint, petición GET con id
app.get('/libros/:id', async (req, res) => {
  console.log(req.params);

  const conn = await getConnection();

  const [results] = await conn.query (`
    SELECT * 
      FROM libros
      WHERE id = ?;`, [req.params.id]);
  
  await conn.end();

  res.json(
    results [0]
  );
});

//Tercer endpoint, petición POST para añadir un nuevo libro
app.post('/libros', async (req, res) => {
  console.log(req.body);

  //Condicionales para comprobar que vienen los parámetros obligatorios
  try {
    const conn = await getConnection(); 

    const [results] = await conn.execute(`
        INSERT INTO libros (nombre, autora, paginas) 
        VALUES (?, ?, ?);`,
        [req.body.nombre, req.body.autora, parseInt(req.body.paginas, 10)]
    );

    res.json({
      "success": true,
      "id": results.insertId 
    });

    await conn.end();
    return; 
  }


  catch(err) {
    console.log(err);
    res.status(500).json({
        "success": false,
        "message": err.toString()
    });
    return;
  }

});

//Cuarto endpoint, actualizar un libro con petición PUT
app.put('/libros/:id', async (req, res) => {
  console.log(req.body);
  console.log(req.params.id); 
 
  //Condicionales para comprobar que vienen los parámetros obligatorios
  try {
    const conn = await getConnection(); 

    const [results] = await conn.execute(`
      UPDATE libros 
        SET nombre=?, autora=?, paginas=?
        WHERE id=?;`,
      [req.body.nombre, req.body.autora, parseInt(req.body.paginas, 10), req.params.id]
    );

  await conn.end();

  res.json({
    "success": true,
  });
}

  catch(err) {
    res.status(500).json({
      "success": false,
      "message": err.toString()
    })
  }

});

//Quinto endpoint, eliminar un libro con petición DELETE
app.delete('/libros/:id', async (req, res) => {
  console.log(req.params.id); 
 
  //Condicionales para comprobar que vienen los parámetros obligatorios
  try {
    const conn = await getConnection(); 

    const [results] = await conn.execute(`
        DELETE FROM libros
        WHERE id=?;`,
      [req.params.id]
    );

  await conn.end();

  res.json({
    "success": true,
  });
}

  catch(err) {
    res.status(500).json({
      "success": false,
      "message": err.toString()
    })
  }
});