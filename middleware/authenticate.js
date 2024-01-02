import jwt from "jsonwebtoken";
import "dotenv/config";
import { HttpError } from "../helpers/index.js";
import User from "../models/User.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization === undefined) {
    return next(HttpError(401, "Not authorized"));
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }
  try {
    const { _id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(_id);
    if (user === null || user.token !== token || user.token === undefined) {
      return next(HttpError(401));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};
export default authenticate;
