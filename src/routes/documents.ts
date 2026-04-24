import { Router } from "express";

const router = Router();
// will add this later
router.use(authenticate);

router.get("/", getDocuments);
router.get("/:id", getDocument);
router.post("/", createDocument);
router.patch("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;
