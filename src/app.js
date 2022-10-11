const express = require('express');
const Pool = require('pg').Pool;
const cors = require('cors');
const PORT = 3001;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
})

const app = express();
app.use(cors());
app.listen(PORT, () => console.log(`Sofeo API Listening on Port ${PORT}`));

app.get('/', (req, res) => {
   res.status(200).send("This is the sofeo database")
})

app.get('/user', (req, res) => {
   pool.query('SELECT user_id, areas, loginname FROM users', (error, results) => {
      if(error){
         res.status(500)
         console.log(error)
      }

      //Create Response Json
      var object = {
         "count": results.rowCount,
         "data": results.rows,
      }

      res.status(200).json(object);
   })
})

app.get('/user/:userId', (req, res) => {
   const userId = req.params.userId
   console.log(req.params.userId)
   pool.query('SELECT user_id, loginname, area_id FROM users WHERE user_id LIKE $1', [userId], (error, results) => {
      if(error){
         res.status(500)
         console.log(error)
      }
      res.status(200).json(results.rows)
   })
})