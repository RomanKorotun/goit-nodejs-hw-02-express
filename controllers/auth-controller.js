import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { HttpError } from "../helpers/index.js";
import User, {
  registerSchema,
  loginSchema,
  userUpdateSubscription,
} from "../models/User.js";

const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({
      user: {
        email: newUser.email,
        subsckription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcryptjs.compare(password, user.password);
    if (passwordCompare === false) {
      throw HttpError(401, "Email or password is wrong");
    }
    const { _id } = user;
    const payload = {
      _id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findOneAndUpdate(_id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findOneAndUpdate({ _id }, { token: "" });
  res.status(204).send();
};
const current = (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};
const updateSubscription = async (req, res, next) => {
  try {
    const { error } = userUpdateSubscription.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email, _id } = req.user;
    const user = await User.findOneAndUpdate({ email, _id }, req.body);
    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  current,
  updateSubscription,
};
