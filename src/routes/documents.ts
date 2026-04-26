import { Router } from "express";
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/documentController";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

router.get("/", getDocuments);
router.get("/:id", getDocument);
router.post("/", createDocument);
router.patch("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;
