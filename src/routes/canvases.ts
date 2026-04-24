import { Router } from "express";

const router = Router();

router.use(authenticate);

router.get("/", getCanvases);
router.get("/:id", getCanvas);
router.post("/", createCanvas);
router.patch("/:id", updateCanvas);
router.delete("/:id", deleteCanvas);

export default router;
