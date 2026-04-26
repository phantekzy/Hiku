import { Router } from "express";
import {
  getDiagrams,
  getDiagram,
  createDiagram,
  updateDiagram,
  deleteDiagram,
} from "../controllers/diagramController";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

router.get("/", getDiagrams);
router.get("/:id", getDiagram);
router.post("/", createDiagram);
router.patch("/:id", updateDiagram);
router.delete("/:id", deleteDiagram);

export default router;
