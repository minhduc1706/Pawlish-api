import { Request, Response, NextFunction } from "express";
import { PetService } from "../services/pet.service";

export class PetController {
  async getPetsByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const pets = await PetService.getPetsByUser(userId);
      res.status(200).json(pets);
    } catch (error) {
      next(error);
    }
  }

  async getPetById(req: Request, res: Response, next: NextFunction) {
    try {
      const { petId } = req.params;
      const pet = await PetService.getPetById(petId);
      res.status(200).json(pet);
    } catch (error) {
      next(error);
    }
  }

  async createPet(req: Request, res: Response, next: NextFunction) {
    try {
      const petData = req.body;
      const newPet = await PetService.createPet(petData);
      res.status(201).json(newPet);
    } catch (error) {
      next(error);
    }
  }

  async updatePet(req: Request, res: Response, next: NextFunction) {
    try {
      const { petId } = req.params;
      const petData = req.body;
      const updatedPet = await PetService.updatePet(petId, petData);
      res.status(200).json(updatedPet);
    } catch (error) {
      next(error);
    }
  }

  async deletePet(req: Request, res: Response, next: NextFunction) {
    try {
      const { petId } = req.params;
      await PetService.deletePet(petId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getAllPet(req: Request, res: Response, next: NextFunction) {
    try {
      const pets = await PetService.getAllPets();
      res.status(200).json(pets);
    } catch (error) {
      next(error);
    }
  }
}
