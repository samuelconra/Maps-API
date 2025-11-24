import { Router } from "express";
import Place from "../models/place.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const places = await Place.find();
        res.status(200).json(places);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/", async (req, res) => {
    const { name, description, latitude, longitude  } = req.body;
    try {
        const place = new Place({
            name,
            description,
            location: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        });

        const saved = await place.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default router;