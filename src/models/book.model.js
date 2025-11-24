import mongoose from "mongoose";

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    }
});

export default mongoose.model("Book", BookSchema);