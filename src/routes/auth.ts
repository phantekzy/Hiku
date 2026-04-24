import { Router } from "express";

const router = Router();

// will add this later
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);

export default router;
