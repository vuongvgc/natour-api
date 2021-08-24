const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const { exit } = require('process');
const Tour = require('../../models/toursModel');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB is connect');
  })
  .catch((err) => {
    console.log(err);
  });

// IMPORT DATA TO DB FROM JSON
const data = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const importData = async () => {
  try {
    await Tour.create(data);
  } catch (err) {
    console.log(err);
  }
  exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
  } catch (err) {
    console.log(err);
  }
  exit();
};
// importData();
// deleteData();
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// node './dev-data/data/import-dev-data.js' --import
