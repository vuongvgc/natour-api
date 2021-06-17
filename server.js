const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const a = 2;
a = 3;
// console.log(app.get('env'));
console.log(process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
