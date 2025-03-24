import express from "express";
import { InventoryController } from "../controllers/inventory.controller";

const router = express.Router();
const inventoryController = new InventoryController();

router.get("/", inventoryController.getInventory.bind(inventoryController));
router.post("/", inventoryController.addToInventory.bind(inventoryController));
router.patch("/:id/use", inventoryController.useInventory.bind(inventoryController));
router.delete("/:id", inventoryController.deleteFromInventory.bind(inventoryController));
router.get("/:id/stock-movements", inventoryController.getStockMovements.bind(inventoryController));
router.patch("/:id", inventoryController.updateInventory.bind(inventoryController));

export default router;