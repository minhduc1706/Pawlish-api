import { Pet } from "../models/pet.model";
import { IPet } from "../interfaces/pet.interface";

export class PetService {
  static async getPetsByUser(userId: string): Promise<IPet[]> {
    const pets = await Pet.find({ user_id: userId })
      .populate("user_id", "full_name email phone address");
    return pets.length ? pets : []; 
  }

  static async getPetById(petId: string): Promise<IPet | null> {
    const pet = await Pet.findById(petId)
      .populate("user_id", "full_name email phone");
    return pet || null;
  }

  static async createPet(petData: Partial<IPet>): Promise<IPet> {
    const newPet = new Pet(petData);
    await newPet.save();
    return newPet.populate("user_id", "full_name email phone");
  }

  static async updatePet(petId: string, petData: Partial<IPet>): Promise<IPet | null> {
    const updatedPet = await Pet.findByIdAndUpdate(petId, petData, { new: true })
      .populate("user_id", "full_name email phone");
    return updatedPet || null; 
  }

  static async deletePet(petId: string): Promise<void> {
    await Pet.findByIdAndDelete(petId); 
  }

  static async getAllPets(): Promise<IPet[]> {
    try {
      const pets = await Pet.find().populate("user_id", "full_name phone");
      return pets;
    } catch (error) {
      throw new Error("Không thể lấy danh sách thú cưng: " + (error as Error).message);
    }
  }
}