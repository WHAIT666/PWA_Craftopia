import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

// Configuração do armazenamento para o multer
const storage = multer.diskStorage({
  // Destino do armazenamento - diretório 'uploads/'
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  // Nome do arquivo - incluindo timestamp para evitar conflitos de nomes
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Função para verificar o tipo do arquivo enviado
function checkFileType(file, cb) {
  // Tipos de arquivo permitidos: jpg, jpeg, png
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  // Verifica se a extensão e o tipo MIME correspondem aos permitidos
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    // Se não corresponder, retorna um erro indicando que apenas imagens são permitidas
    cb({ message: 'Apenas imagens são permitidas!' });
  }
}

// Configuração do multer com as opções de armazenamento e verificação de tipo de arquivo
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Rota para lidar com o upload de uma única imagem
router.post('/', upload.single('image'), (req, res) => {
  // Responder com uma mensagem de sucesso e o caminho da imagem
  res.send({
    message: 'Imagem enviada com sucesso',
    image: `/${req.file.path}`,
  });
});

// Exporta o roteador que lida com o upload de imagens
export default router;
