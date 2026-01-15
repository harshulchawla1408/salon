import Service from "../models/Service.js";

/**
 * Get all active services
 */
export const getServices = async (req, res, next) => {
  try {
    const { gender } = req.query;
    const query = { isActive: true };
    
    // Filter by gender if provided
    if (gender && ["male", "female", "unisex"].includes(gender)) {
      query.$or = [
        { gender: gender },
        { gender: "unisex" }
      ];
    }
    
    const services = await Service.find(query).sort({ name: 1 });
    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return next(error);
  }
};

/**
 * Get single service by ID
 */
export const getService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service || !service.isActive) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return next(error);
  }
};

/**
 * Create service (Admin only)
 */
export const createService = async (req, res, next) => {
  try {
    const { name, description, duration, price } = req.body;

    if (!name || !duration || price === undefined) {
      return res.status(400).json({
        message: "Name, duration, and price are required",
      });
    }

    const service = await Service.create({
      name,
      description: description || "",
      duration,
      price,
      isActive: true,
    });

    return res.status(201).json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    return next(error);
  }
};

/**
 * Update service (Admin only)
 */
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price, gender, isActive } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (name) service.name = name;
    if (description !== undefined) service.description = description;
    if (duration) service.duration = duration;
    if (price !== undefined) service.price = price;
    if (gender && ["male", "female", "unisex"].includes(gender)) {
      service.gender = gender;
    }
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();
    return res.status(200).json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    return next(error);
  }
};
