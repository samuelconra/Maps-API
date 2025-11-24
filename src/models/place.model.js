import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

PlaceSchema.index({ location: '2dsphere' });

export default mongoose.model("Place", PlaceSchema);
