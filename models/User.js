import mongoose, { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

mongoose.Schema.Types.String.cast(false);

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    match: emailRegexp,
    unique: true,
    required: [true, "Email is required"],
  },
  subscription: {
    type: String,
    enum: subscriptionList,
    default: "starter",
  },
  avatarURL: String,
  token: String,
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
});

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

export const registerSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string().valid(...subscriptionList),
});

export const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

export const verifyEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required field email",
  }),
});

export const userUpdateSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

const User = model("user", userSchema);

export default User;
