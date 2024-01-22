// Middleware para lidar com funções assíncronas
const asyncHandler = (fn) => (req, res, next) =>
  // Envolve a chamada da função assíncrona em uma Promise
  Promise.resolve(fn(req, res, next)).catch(next);

// Exporta a função asyncHandler para uso em outros módulos
export default asyncHandler;
