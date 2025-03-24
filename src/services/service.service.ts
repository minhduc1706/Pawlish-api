import { AppError } from "../errors/AppError";
import { IService } from "../interfaces/service.interface";
import { Service } from "../models/service.model";
import { ServiceCategory } from "../models/service_category.model";

export class ServiceService {
  static async getAllServices(): Promise<IService[]> {
    const services = await Service.find()
      .populate("category_id", "name description");
    console.log("Services:", services);
    return services;
  }

  static async getServiceById(id: string): Promise<IService> {
    const service = await Service.findOne({
      _id: id,
      available: true,
    }).populate("category_id", "name description");
    if (!service) throw new AppError("Service not found or unavailable", 404);
    return service;
  }

  static async addService(serviceData: Partial<IService>): Promise<IService> {
    if (
      !serviceData.name ||
      !serviceData.price ||
      !serviceData.duration ||
      !serviceData.category_id
    ) {
      throw new AppError("Missing required fields", 400);
    }
    const { category_id } = serviceData;
    const categoryExists = await ServiceCategory.findById(category_id);
    if (!categoryExists) throw new AppError("Category not found", 404);

    const existingService = await Service.findOne({ name: serviceData.name });
    if (existingService)
      throw new AppError("Service with this name already exists", 400);

    const newService = new Service(serviceData);
    return await newService.save();
  }

  static async updateService(
    id: string,
    serviceData: Partial<IService>
  ): Promise<IService> {
    if (serviceData.category_id) {
      const categoryExists = await ServiceCategory.findById(
        serviceData.category_id
      );
      if (!categoryExists) throw new AppError("Category not found", 404);
    }

    const updatedService = await Service.findByIdAndUpdate(id, serviceData, {
      new: true,
    }).populate("category_id", "name description");
    if (!updatedService) throw new AppError("Service not found", 404);
    return updatedService;
  }

  static async deleteService(id: string): Promise<void> {
    const service = await Service.findByIdAndUpdate(
      id,
      { available: false },
      { new: true }
    );
    if (!service) throw new AppError("Service not found", 404);
    await Service.deleteOne({ _id: id });
  }
}
  