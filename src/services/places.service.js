import PlaceModel from "../models/place.model.js";
import AppError from "../utils/AppError.js";

class PlacesService {
    static async getAll() {
        return await PlaceModel.find();
    }

    static async create(data) {
        const { name, description, latitude, longitude } = data;
        
        const place = new PlaceModel({
            name,
            description,
            location: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        });
        return await place.save();
    }

    static async update(id, data) {
        const newData = {
            name: data.name,
            description: data.description
        };

        if (data.latitude && data.longitude) {
            newData.location = {
                type: "Point",
                coordinates: [data.longitude, data.latitude]
            };
        }

        const updatedPlace = await PlaceModel.findByIdAndUpdate(id, newData, { new: true });
        if (!updatedPlace) throw new AppError("Lugar no encontrado", 404);
        
        return updatedPlace;
    }

    static async delete(id) {
        const deletedPlace = await PlaceModel.findByIdAndDelete(id);
        if (!deletedPlace) throw new AppError("Lugar no encontrado", 404);
        return deletedPlace;
    }
}

export default PlacesService;