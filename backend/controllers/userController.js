import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Autenticar usuário e obter token
// @route   POST /api/users/auth
// @access  Público
const authUser = asyncHandler(async (req, res) => {
  // Extrair email e senha do corpo da requisição
  const { email, password } = req.body;

  // Buscar usuário pelo email
  const user = await User.findOne({ email });

  // Verificar se o usuário existe e a senha está correta
  if (user && (await user.matchPassword(password))) {
    // Gerar e enviar token de autenticação
    generateToken(res, user._id);

    // Responder com informações do usuário (sem a senha)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Email ou senha inválidos');
  }
});

// @desc    Registrar um novo usuário
// @route   POST /api/users
// @access  Público
const registerUser = asyncHandler(async (req, res) => {
  // Extrair nome, email e senha do corpo da requisição
  const { name, email, password } = req.body;

  // Verificar se já existe um usuário com o mesmo email
  const userExists = await User.findOne({ email });

  // Se o usuário já existe, retornar erro
  if (userExists) {
    res.status(400);
    throw new Error('Usuário já cadastrado');
  }

  // Criar um novo usuário
  const user = await User.create({
    name,
    email,
    password,
  });

  // Se o usuário for criado com sucesso, gerar e enviar token de autenticação
  if (user) {
    generateToken(res, user._id);

    // Responder com informações do usuário (sem a senha)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Dados de usuário inválidos');
  }
});

// @desc    Logout do usuário / limpar cookie
// @route   POST /api/users/logout
// @access  Público
const logoutUser = (req, res) => {
  // Limpar o cookie de autenticação
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logout realizado com sucesso' });
};

// @desc    Obter perfil do usuário
// @route   GET /api/users/profile
// @access  Privado
const getUserProfile = asyncHandler(async (req, res) => {
  // Buscar usuário pelo ID
  const user = await User.findById(req.user._id);

  // Se o usuário for encontrado, responder com suas informações (sem a senha)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }
});

// @desc    Atualizar perfil do usuário
// @route   PUT /api/users/profile
// @access  Privado
const updateUserProfile = asyncHandler(async (req, res) => {
  // Buscar usuário pelo ID
  const user = await User.findById(req.user._id);

  // Se o usuário for encontrado, atualizar suas informações
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Se uma nova senha foi fornecida, atualizar a senha
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Salvar o usuário atualizado no banco de dados
    const updatedUser = await user.save();

    // Responder com as informações atualizadas do usuário (sem a senha)
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }
});

// @desc    Obter todos os usuários
// @route   GET /api/users
// @access  Privado/Admin
const getUsers = asyncHandler(async (req, res) => {
  // Buscar todos os usuários no banco de dados
  const users = await User.find({});
  res.json(users);
});

// @desc    Excluir usuário
// @route   DELETE /api/users/:id
// @access  Privado/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // Buscar usuário pelo ID
  const user = await User.findById(req.params.id);

  // Se o usuário for encontrado
  if (user) {
    // Impedir a exclusão de um usuário administrador
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Não é possível excluir um usuário administrador');
    }
    // Excluir o usuário do banco de dados
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'Usuário removido' });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }
});

// @desc    Obter usuário por ID
// @route   GET /api/users/:id
// @access  Privado/Admin
const getUserById = asyncHandler(async (req, res) => {
  // Buscar usuário pelo ID (excluindo a senha)
  const user = await User.findById(req.params.id).select('-password');

  // Se o usuário for encontrado, responder com suas informações
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }
});

// @desc    Atualizar usuário
// @route   PUT /api/users/:id
// @access  Privado/Admin
const updateUser = asyncHandler(async (req, res) => {
  // Buscar usuário pelo ID
  const user = await User.findById(req.params.id);

  // Se o usuário for encontrado, atualizar suas informações
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    // Salvar o usuário atualizado no banco de dados
    const updatedUser = await user.save();

    // Responder com as informações atualizadas do usuário
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }
});

// Exportar os controladores de usuário
export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};