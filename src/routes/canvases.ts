import { Router } from "express";
import {
  getCanvases,
  getCanvas,
  createCanvas,
  updateCanvas,
  deleteCanvas,
} from "../controllers/canvasController";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

router.get("/", getCanvases);
router.get("/:id", getCanvas);
router.post("/", createCanvas);
router.patch("/:id", updateCanvas);
router.delete("/:id", deleteCanvas);

export default router;
