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

router.get("/protected", protectedRoute, (req, res) => {
  res.status(200).json({
    status: true,
    message: "Authenticated User",
    user: req.user, // Access the user object attached by the protectedRoute middleware
  });
});

export default router;
