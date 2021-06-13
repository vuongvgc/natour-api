const fs = require('fs');
const express = require('express');
const app = express();
// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server side');
//   res
//     .status(200)
//     .json({ messenger: 'Hello from the server side', app: 'natour' });
// });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.post('/', (req, res) => {
  res.status(404).send('Page not found');
});
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
