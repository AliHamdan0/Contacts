const { Router } = require('express');
const {
  getContacts,
  getContactByID,
  postContact,
  putContact,
  deleteContact,
} = require('../controllers/contactController');
const validateToken = require('../middlewares/validateTokenHandler');
const router = Router();

router.use(validateToken);

router.get('/', getContacts);

router.get('/:id', getContactByID);

router.post('/', postContact);

router.put('/:id', putContact);

router.delete('/:id', deleteContact);

module.exports = router;
