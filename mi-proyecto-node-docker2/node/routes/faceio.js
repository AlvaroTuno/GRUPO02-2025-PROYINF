import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Ruta FaceIO funcionando (placeholder)" });
});

export default router;
