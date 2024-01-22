import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Público
const getProducts = asyncHandler(async (req, res) => {
  // Configuração da paginação e pesquisa por palavra-chave
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  // Contar o número total de produtos com base na palavra-chave
  const count = await Product.countDocuments({ ...keyword });
  // Obter produtos paginados
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Obter um único produto por ID
// @route   GET /api/products/:id
// @access  Público
const getProductById = asyncHandler(async (req, res) => {
  // Buscar um produto por ID
  const product = await Product.findById(req.params.id);
  // Verificar se o produto foi encontrado
  if (product) {
    return res.json(product);
  }
  res.status(404);
  throw new Error('Recurso não encontrado');
});

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Privado/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Criar um novo produto com valores padrão
  const product = new Product({
    name: 'Nome de exemplo',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Marca de exemplo',
    category: 'Categoria de exemplo',
    countInStock: 0,
    numReviews: 0,
    description: 'Descrição de exemplo',
  });
  // Salvar o novo produto no banco de dados
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Atualizar um produto existente
// @route   PUT /api/products/:id
// @access  Privado/Admin
const updateProduct = asyncHandler(async (req, res) => {
  // Extrair informações do corpo da requisição
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  // Buscar o produto por ID
  const product = await Product.findById(req.params.id);
  // Verificar se o produto foi encontrado
  if (product) {
    // Atualizar as informações do produto
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    // Salvar o produto atualizado no banco de dados
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
});

// @desc    Excluir um produto
// @route   DELETE /api/products/:id
// @access  Privado/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  // Buscar o produto por ID
  const product = await Product.findById(req.params.id);
  // Verificar se o produto foi encontrado
  if (product) {
    // Excluir o produto do banco de dados
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Produto removido' });
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
});

// @desc    Criar uma nova avaliação para o produto
// @route   POST /api/products/:id/reviews
// @access  Privado
const createProductReview = asyncHandler(async (req, res) => {
  // Extrair informações da avaliação do corpo da requisição
  const { rating, comment } = req.body;
  // Buscar o produto por ID
  const product = await Product.findById(req.params.id);
  // Verificar se o produto foi encontrado
  if (product) {
    // Verificar se o usuário já avaliou o produto
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Produto já avaliado');
    }
    // Criar a avaliação
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    // Adicionar a avaliação ao produto e atualizar as estatísticas
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    // Salvar o produto atualizado no banco de dados
    await product.save();
    res.status(201).json({ message: 'Avaliação adicionada' });
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
});

// @desc    Obter os produtos mais bem avaliados
// @route   GET /api/products/top
// @access  Público
const getTopProducts = asyncHandler(async (req, res) => {
  // Obter os produtos mais bem avaliados (top 3)
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

// Exportar os controladores de produto
export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
