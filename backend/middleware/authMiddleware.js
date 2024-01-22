import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// Middleware para proteger rotas - O usuário deve estar autenticado
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Ler o JWT do cookie chamado 'jwt'
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verificar o token utilizando a chave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obter informações do usuário a partir do ID no token (excluindo a senha)
      req.user = await User.findById(decoded.userId).select('-password');

      // Continuar para a próxima camada de middleware
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Não autorizado, falha no token');
    }
  } else {
    // Se não houver token, responder com status 401 e mensagem de erro
    res.status(401);
    throw new Error('Não autorizado, nenhum token fornecido');
  }
});

// Middleware para proteger rotas - O usuário deve ser um administrador
const admin = (req, res, next) => {
  // Verificar se o usuário está autenticado e é um administrador
  if (req.user && req.user.isAdmin) {
    // Continuar para a próxima camada de middleware
    next();
  } else {
    // Se o utilizador não for um administrador, responder com status 401 e mensagem de erro
    res.status(401);
    throw new Error('Não autorizado como administrador');
  }
};

// Exportar os middlewares 'protect' e 'admin'
export { protect, admin };