import express from "express";
import { authenticate, isEmptyBody } from "../../middleware/index.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, authController.register);
authRouter.post("/login", isEmptyBody, authController.login);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/current", authenticate, authController.current);
authRouter.patch("/", authenticate, authController.updateSubscription);

export default authRouter;
