import bcryptjs from "bcryptjs";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Jimp from "jimp";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import { HttpError } from "../helpers/index.js";
import User, {
  registerSchema,
  loginSchema,
  userUpdateSubscription,
  verifyEmailSchema,
} from "../models/User.js";
import { sendEmail } from "../helpers/index.js";

const { JWT_SECRET, BASE_URL } = process.env;

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
    const avatarURL = gravatar.url(email);
    const hashPassword = await bcryptjs.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await User.create({
      ...req.body,
      avatarURL,
      password: hashPassword,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a href=${BASE_URL}/api/users/verify/${verificationToken}>Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

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
const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (user === null) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};
const resendVerifyEmail = async (req, res, next) => {
  try {
    const { error } = verifyEmailSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a href=${BASE_URL}/api/users/verify/${user.verificationToken}>Click to verify email</a>`,
    };
    await sendEmail(verifyEmail);
    res.json({
      message: "Verification email sent",
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
    if (user.verify === false) {
      throw HttpError(401, "Email not verify");
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
const updateAvatar = async (req, res, next) => {
  try {
    if (req.file === undefined) {
      throw HttpError(400, "field avatarURL is required");
    }
    const { path: oldPath, filename } = req.file;
    (await Jimp.read(oldPath)).resize(250, 250);
    const newPath = path.resolve("public", "avatars", filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", filename);
    const { email, _id } = req.user;
    const user = await User.findOneAndUpdate({ email, _id }, { avatarURL });
    res.json({
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  verify,
  resendVerifyEmail,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
};
