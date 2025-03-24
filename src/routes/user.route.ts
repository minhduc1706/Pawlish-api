import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();
const { getAllUsers, getUserById, updateUser, deleteUser } =
  userController;

router.get("/", getAllUsers.bind(userController));
router.get("/:id", getUserById.bind(userController));
router.put("/:id", updateUser.bind(userController));
router.delete("/:id", deleteUser.bind(userController));

export default router;
