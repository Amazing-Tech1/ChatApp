import express, { Router } from "express";
import {
  signUp,
  logIn,
  logOut,
  updateProfile,
  refreshToken,
} from "../controllers/authController.js";
import { protectedRoute } from "../middleware/auth.js";

const router: Router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);

router.post("/refresh-token", refreshToken);

router.put("/update-profile", protectedRoute, updateProfile);

export default router;
