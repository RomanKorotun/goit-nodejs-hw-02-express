import express from "express";
import { authenticate, isEmptyBody, upload } from "../../middleware/index.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, authController.register);
authRouter.get("/verify/:verificationToken", authController.verify);
authRouter.post("/verify", authController.resendVerifyEmail);
authRouter.post("/login", isEmptyBody, authController.login);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/current", authenticate, authController.current);
authRouter.patch("/", authenticate, authController.updateSubscription);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  authController.updateAvatar
);

export default authRouter;
