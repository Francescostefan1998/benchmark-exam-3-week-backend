import mongoose from "mongoose";

export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: err.message });
  } else if (err instanceof mongoose.Error.CastError) {
    res.status(400).send({ message: "Wrong id" });
  } else {
    next(err);
  }
};

export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    return res.status(404).json({ error: err.message });
  } else {
    next(err);
  }
};

export const genericErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Generic Error Message" });
};
