const { Router } = require('express');
const {
  addUser,
  login,
  currentUser,
} = require('../controllers/userController');
const validateToken = require('../middlewares/validateTokenHandler');
const router = Router();

router.post('/register', addUser);

router.post('/login', login);

router.get('/current', validateToken, currentUser);

module.exports = router;
