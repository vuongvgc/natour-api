const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
exports.checkID = (req, res, next, val) => {
  console.log(`This is parameter middleware { ${val} }`);
  const id = req.params.id;
  if (id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    result: tours.length,
    time: req.requestTime,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  const tour = tours[id];
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  console.log(req.body);
  const newID = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newID }, req.body);
  const newTour = { id: newID, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Done',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    data: {
      tours: '<update tour here ....',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: {
      tours: null,
    },
  });
};
