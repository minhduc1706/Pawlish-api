import { Request, Response, NextFunction } from "express";
import { ServiceService } from "../services/service.service";

export class ServiceController {
  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await ServiceService.getAllServices();
      res.json(services);
      res.status(200).json(services);
    } catch (error) {
      next(error);
    }
  }

  async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await ServiceService.getServiceById(req.params.id);
      res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }

  async addService(req: Request, res: Response, next: NextFunction) {
    try {
      const newService = await ServiceService.addService(req.body);
      res.status(201).json(newService);
    } catch (error) {
      next(error);
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedService = await ServiceService.updateService(req.params.id, req.body);
      res.status(200).json(updatedService);
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      await ServiceService.deleteService(req.params.id);
      res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}