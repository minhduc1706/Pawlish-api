import express from "express";
import { AdminController } from "../../controllers/admin/dashboard.controller";

const router = express.Router();
const controller = new AdminController();

router.get("/stat", controller.getStats);
router.get("/sales", controller.getSales);
router.get("/revenue-profit", controller.getRevenueProfit);
router.get("/product-categories", controller.getProductCategories);
router.get("/product-stats", controller.getProductStats);
router.get("/low-stock-products", controller.getLowStockProducts);
router.get("/recent-activities", controller.getRecentActivities);
export default router;
