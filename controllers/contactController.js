const Contacts = require('../models/contactModel');
const asyncHandler = require('express-async-handler');

//@desc get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const contacts = await Contacts.find({ user_id });
  res.status(200).json(contacts);
});

//@desc get contact by id
//@route GET /api/contacts/:id
//@access private
const getContactByID = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user_id = req.user.id;
  const contact = await Contacts.findOne({ _id: id, user_id });
  if (contact) res.status(200).json(contact);
  else {
    res.status(404);
    throw new Error('contact not found');
  }
});

//@desc add a new contact
//@route POST /api/contacts
//@access private
const postContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const user_id = req.user.id;
  const contact = await Contacts.create({ ...req.body, user_id });
  res.status(201).json(contact);
});

//@desc update contact
//@route PUT /api/contacts/:id
//@access private
const putContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const oldContact = await Contacts.findById(id);
  if (!oldContact) {
    res.status(404);
    throw new Error('contact not exists');
  }
  if (oldContact.user_id.toString() != req.user.id) {
    res.status(403);
    throw new Error("you don't have permission to do that");
  }
  const newContact = await Contacts.findByIdAndUpdate(id, req.body, {
    new: true, //to return the new document
  });
  res.status(200).json(newContact);
});

//@desc delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const oldContact = await Contacts.findById(id);
  if (!oldContact) {
    res.status(404);
    throw new Error('contact not exists');
  }
  if (oldContact.user_id.toString() != req.user.id) {
    res.status(403);
    throw new Error("you don't have permission to do that");
  }
  const deletedContact = await Contacts.deleteOne({ _id: id });
  if (deletedContact) res.status(200).json(deletedContact);
});

module.exports = {
  getContacts,
  getContactByID,
  postContact,
  putContact,
  deleteContact,
};
