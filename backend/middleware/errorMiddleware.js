// Middleware para lidar com rotas não encontradas (404 Not Found)
const notFound = (req, res, next) => {
  // Criar um erro indicando que a rota não foi encontrada
  const error = new Error(`Não Encontrado - ${req.originalUrl}`);
  
  // Definir o status da resposta como 404
  res.status(404);

  // Passar o erro para o próximo middleware encarregado de lidar com erros
  next(error);
};

// Middleware para lidar com erros globais
const errorHandler = (err, req, res, next) => {
  // Determinar o status da resposta com base no status da resposta anterior ou padrão para 500 (Erro interno do servidor)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Obter a mensagem de erro
  let message = err.message;

  // Se o erro for um erro de Mongoose "not found" (CastError com kind ObjectId),
  // definir o status como 404 e alterar a mensagem para "Recurso não encontrado"
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Recurso não encontrado';
  }

  // Responder com o status e mensagem de erro
  res.status(statusCode).json({
    message: message,
    // Se estiver em ambiente de produção, não incluir a error pile
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Exportar os middlewares 'notFound' e 'errorHandler'
export { notFound, errorHandler };
