import { Router } from "express";

const router = Router();

import {
  getProducts,
  getOrders,
  changeStatusProduct,
} from "../controllers/shop.js";
import { verifyToken } from "../middleware/is-auth.js";

router.get("/delivering", verifyToken, getOrders);
router.get("/products", verifyToken, getProducts);
router.put("/:orderItemId/status", verifyToken, changeStatusProduct);

export default router;
