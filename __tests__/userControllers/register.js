const { addUser } = require('../../controllers/userController');
const bcrypt = require('bcryptjs');
const Users = require('../../models/userModel');

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

jest.mock('../../models/userModel', () => ({
  create: jest.fn(),
}));

describe('createUser', () => {
  it('should create a new user and return a response with the user data', async () => {
    const req = {
      body: {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const hashedPassword = 'hashedPassword';
    bcrypt.hash.mockResolvedValue(hashedPassword);

    const newUser = {
      _id: '123',
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    };
    Users.create.mockResolvedValue(newUser);

    await addUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    expect(Users.create).toHaveBeenCalledWith({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
  });

  it('should return a 400 status code and throw an error if the user is not created', async () => {
    const req = {
      body: {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    Users.create.mockResolvedValue(null);

    try {
      await addUser(req, res);
    } catch (error) {
      expect(res.status).toHaveBeenCalledWith(400);
      expect(error.message).toBe('Data is not valid');
    }
  });
});
