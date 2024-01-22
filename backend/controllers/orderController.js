import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// @desc    Criar um novo pedido
// @route   POST /api/orders
// @access  Privado
const addOrderItems = asyncHandler(async (req, res) => {
  // Extrair informações do corpo da requisição
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Verificar se existem itens no pedido
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Nenhum item no pedido');
  } else {
    // Criar um novo pedido com base nas informações fornecidas
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Salvar o pedido no banco de dados
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Obter pedidos do usuário logado
// @route   GET /api/orders/myorders
// @access  Privado
const getMyOrders = asyncHandler(async (req, res) => {
  // Buscar pedidos associados ao ID do usuário logado
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Obter pedido por ID
// @route   GET /api/orders/:id
// @access  Privado
const getOrderById = asyncHandler(async (req, res) => {
  // Buscar pedido por ID e incluir informações do usuário relacionado
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  // Verificar se o pedido foi encontrado
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado');
  }
});

// @desc    Atualizar status do pedido para pago
// @route   GET /api/orders/:id/pay
// @access  Privado
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // Buscar pedido por ID
  const order = await Order.findById(req.params.id);

  // Verificar se o pedido foi encontrado
  if (order) {
    // Atualizar informações de pagamento e marcar como pago
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // Salvar o pedido atualizado no banco de dados
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado');
  }
});

// @desc    Atualizar status do pedido para entregue
// @route   GET /api/orders/:id/deliver
// @access  Privado/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  // Buscar pedido por ID
  const order = await Order.findById(req.params.id);

  // Verificar se o pedido foi encontrado
  if (order) {
    // Atualizar informações de entrega e marcar como entregue
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    // Salvar o pedido atualizado no banco de dados
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado');
  }
});

// @desc    Obter todos os pedidos
// @route   GET /api/orders
// @access  Privado/Admin
const getOrders = asyncHandler(async (req, res) => {
  // Buscar todos os pedidos e incluir informações do usuário relacionado
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// Exportar os controladores de pedido
export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};