import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Rota para obter todos os produtos e criar um novo produto (apenas para administradores)
router.route('/').get(getProducts).post(protect, admin, createProduct);

// Rota para obter os produtos mais bem avaliados
router.get('/top', getTopProducts);

// Rota para obter, atualizar ou excluir um produto específico por ID (apenas para administradores)
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

// Rota para adicionar uma avaliação a um produto específico
router.route('/:id/reviews').post(protect, createProductReview);

// Exporta o roteador contendo todas as rotas relacionadas a produtos
export default router;
