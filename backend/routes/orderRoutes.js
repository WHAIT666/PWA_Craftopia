import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Rota para criar um novo pedido e obter todos os pedidos (apenas para administradores)
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);

// Rota para obter os pedidos do usuário logado
router.route('/mine').get(protect, getMyOrders);

// Rota para obter um pedido específico por ID
router.route('/:id').get(protect, getOrderById);

// Rota para atualizar o status de pagamento de um pedido
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Rota para atualizar o status de entrega de um pedido (apenas para administradores)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

// Exporta o roteador contendo todas as rotas relacionadas a pedidos
export default router;
