import { Router } from "express";
import { authorized } from "../middleware/auth.middleware";
import { PetController } from "../controllers/pet.controllet";

const router = Router();
const petController = new PetController();
router.get(
  "/user/:userId",
  authorized(["admin", "customer","staff"]),
  petController.getPetsByUser
);

router.get(
  "/",
  authorized(["admin", "customer","staff"]),
  petController.getAllPet
);

router.get(
  "/:petId",
  authorized(["admin", "customer","staff"]),
  petController.getPetById
);

router.post("/", authorized(["admin", "customer"]), petController.createPet);

router.put(
  "/:petId",
  authorized(["admin", "customer", "staff"]),
  petController.updatePet
);

router.delete(
  "/:petId",
  authorized(["admin", "customer","staff"]),
  petController.deletePet
);

export default router;
