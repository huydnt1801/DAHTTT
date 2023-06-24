import { Router } from "express";

const router = Router();

import { getProducts, addProduct, deleteProduct, editProduct } from "../controllers/product.js";
import { verifyToken } from "../middleware/is-auth.js";

router.get("/", getProducts);
router.post("/", verifyToken, addProduct);
router.delete("/:productId",verifyToken,  deleteProduct);
router.put("/:productId", verifyToken, editProduct);

export default router;