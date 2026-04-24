import { Router } from "express";

const router = Router();
router.use(authenticate);

// will add this later
router.get("/", getDiagrams);
router.get("/:id", getDiagram);
router.post("/", createDiagram);
router.patch("/:id", updateDiagram);
router.delete("/:id", deleteDiagram);

export default router;
