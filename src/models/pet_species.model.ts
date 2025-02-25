import { Schema, model, Document } from 'mongoose';
import { IPetSpecies } from '../interfaces/pet_species.interface';

const petSpeciesSchema: Schema<IPetSpecies> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const PetSpecies = model<IPetSpecies>('PetSpecies', petSpeciesSchema);
