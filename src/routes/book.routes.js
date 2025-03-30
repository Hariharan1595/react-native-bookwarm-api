import { Router } from "express";
import { createBook, deleteBook, getBooks, userBook } from "../controllers/book.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = Router();

router.post('/',protectRoute,createBook)
router.get('/',protectRoute,getBooks)
router.delete('/:id',protectRoute,deleteBook)
router.get('/user',protectRoute,userBook)




export default router;