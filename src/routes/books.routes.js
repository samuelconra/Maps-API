import express from "express";
import Book from "../models/book.model.js";
const router = express.Router();

// get all
router.get("/", async (req, res) => {
    Book.find()
        .then((books) => res.json(books))
        .catch((err) => res.status(400).json({ error: err.message })); 
});

// post
router.post("/", async (req, res) => {
    const books = new Book({
        title: req.body.title,
        description: req.body.description,
    });

    books.save()
        .then((book) => res.json(book))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// patch
router.patch("/:id", async (req, res) => {
    Book.updateOne({ _id: req.params.id },
        {
            $set:{description: req.body.description}
        })
        .then((book) => res.json(book))
        .catch((err) => res.status(400).json({ error: err.message }))
});

// delete
router.delete("/:id", async (req, res) => {
    Book.deleteOne({ _id: req.params.id })
        .then((book) => res.json(book))
        .catch((err) => res.status(400).json({ error: err.message }))
});

export default router;
