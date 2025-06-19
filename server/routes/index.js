import express from "express";
import authRoutes from "./auth.route.js";
// import notesRoutes from "./notes.route.js";
// import orderRoutes from "./order.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
// router.use("/notes", notesRoutes);
// router.use("/orders", orderRoutes);

export default router;