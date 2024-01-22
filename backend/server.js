import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Importa a função de conexão com a base de dados
import connectDB from './config/db.js';

// Importa as rotas dos diferentes recursos
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Importa os middlewares de tratamento de erro
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Define a porta do servidor, utilizando a variável de ambiente ou 5000 como padrão
const port = process.env.PORT || 5000;

// Coneecta a base de dados MongoDB
connectDB();

// Cria uma instância do aplicativo Express
const app = express();

// Configura a aplicação para usar JSON e processar dados codificados na URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cofigura a aplicação para utilizar o cookie parser
app.use(cookieParser());

// Configura as rotas para cada recurso específico
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Rota para obter o ID do cliente PayPal do arquivo de configuração
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Define o caminho para os arquivos enviados (uploads) como um dstatic directory
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Configuração específica para o ambiente de produção
if (process.env.NODE_ENV === 'production') {
  // Configura a aplicação para servir arquivos estáticos do diretório 'frontend/build'
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // Qualquer rota que não seja '/api' é redirecionada para o 'index.html' 
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  // Rota padrão para exibir uma mensagem quando o servidor está em execução em ambientes de desenvolvimento
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Utiliza os middlewares de tratamento de erro em caso de rota não encontrada ou outros erros
app.use(notFound);
app.use(errorHandler);

// Inicia o servidor na porta especificada
app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);