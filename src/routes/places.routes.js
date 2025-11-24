import { Router } from "express";
import controller from "../controllers/places.controller.js";
import { handleAsync } from "../middlewares/error.middleware.js";

const router = Router();

router.get("/", handleAsync(controller.getPlaces));
router.post("/", handleAsync(controller.createPlace));
router.patch("/:id", handleAsync(controller.updatePlace));
router.delete("/:id", handleAsync(controller.deletePlace));

export default router;