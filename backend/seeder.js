import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Conecta ao banco de dados MongoDB
connectDB();

// Função para importar dados de exemplo para o banco de dados
const importData = async () => {
  try {
    // Remove todos os documentos nas coleções de Order, Product e User
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insere usuários de exemplo no banco de dados
    const createdUsers = await User.insertMany(users);

    // Obtém o ID do usuário administrador recém-criado
    const adminUser = createdUsers[0]._id;

    // Adiciona o ID do usuário administrador a cada produto de exemplo
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // Insere produtos de exemplo na base de dados
    await Product.insertMany(sampleProducts);

    // Exibe mensagem de sucesso no console
    console.log('Dados Importados!'.green.inverse);

    // Encerra o processo Node.js
    process.exit();
  } catch (error) {
    // Exibe mensagem de erro no console e encerra o processo com código de erro 1
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Função para remover todos os dados da base de dados
const destroyData = async () => {
  try {
    // Remove todos os documentos nas Collections de Order, Product e User
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Exibe mensagem de sucesso no console
    console.log('Dados Destruidos!'.red.inverse);

    // Encerra o processo Node.js
    process.exit();
  } catch (error) {
    // Exibe mensagem de erro no console e encerra o processo com código de erro 1
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Verifica se o argumento de linha de comando é '-d' (destroyData)
if (process.argv[2] === '-d') {
  // Executa a função para remover dados da base de dados
  destroyData();
} else {
  // Se nenhum argumento '-d' for fornecido, executa a função para importar dados
  importData();
}