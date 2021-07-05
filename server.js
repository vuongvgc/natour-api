const dotenv = require('dotenv');
const mongoose = require('mongoose');
process.on('uncaughtException', (err) => {
  console.log('Server still shutdown .....', err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log(con.connection);
    console.log('DB is Connection');
  });
// .catch((err) => {
//   console.log(`DB is  ${err}`);
// });

// console.log(app.get('env'));
// console.log(process.env);
// const tourSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   rating: Number,
// });
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection-Vuong', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

console.log(x);
