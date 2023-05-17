const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

//Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Harga gorengan dua biji sekarang ${port}`)
})