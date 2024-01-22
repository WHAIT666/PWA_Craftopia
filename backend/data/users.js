import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'André Santos',
    email: 'andre@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Pedro',
    email: 'pedro@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;