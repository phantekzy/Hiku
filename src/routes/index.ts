import { Router } from "express";

const router = Router();

// Will add this mfs later
router.use("/auth", authRoutes);
router.use("/documents", documentRoutes);
router.use("/canvases", canvasRoutes);
router.use("/diagrams", diagramRoutes);

export default router;
