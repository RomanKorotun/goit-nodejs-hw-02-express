import { HttError } from "../helpers/index.js";

const isEmptyBodyFavorite = (req, res, next) => {
  const length = Object.keys(req.body).length;
  if (length === 0) {
    return next(HttError(400, "missing field favorite"));
  }
  next();
};

export default isEmptyBodyFavorite;
