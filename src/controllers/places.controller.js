import PlacesService from "../services/places.service.js";

const getPlaces = async (req, res, next) => {
    const places = await PlacesService.getAll();
    res.status(200).json(places);
};

const createPlace = async (req, res, next) => {
    const place = await PlacesService.create(req.body);
    res.status(201).json(place);
};

const updatePlace = async (req, res, next) => {
    const { id } = req.params;
    const place = await PlacesService.update(id, req.body);
    res.status(200).json(place);
};

const deletePlace = async (req, res, next) => {
    const { id } = req.params;
    const place = await PlacesService.delete(id);
    res.status(200).json(place);
};

export default { getPlaces, createPlace, updatePlace, deletePlace };