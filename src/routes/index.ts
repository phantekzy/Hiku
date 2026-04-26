import { Router } from "express";
import authRoutes from "./auth";
import documentRoutes from "./documents";
import canvasRoutes from "./canvases";
import diagramRoutes from "./diagrams";

const router = Router();

router.use("/auth", authRoutes);
router.use("/documents", documentRoutes);
router.use("/canvases", canvasRoutes);
router.use("/diagrams", diagramRoutes);

export default router;
