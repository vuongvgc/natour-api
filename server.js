const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

dotenv.config({ path: './config.env' });

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

// console.log(app.get('env'));
// console.log(process.env);
// const tourSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   rating: Number,
// });
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 5.3,
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price'],
  },
});
const Tour = mongoose.model('Tour', tourSchema);
const testTour = new Tour({
  name: 'The Forest Hiker Vietnam',
  price: 293,
});
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('Create Error', err);
  });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  // console.log(`App running on port ${port}`);
});
