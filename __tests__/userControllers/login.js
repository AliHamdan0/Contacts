const { login } = require('../../controllers/userController');
const Users = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../models/userModel', () => ({
  findOne: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const user = {
  email: 'ali@gmail.com',
  password: '123',
};

const req = {
  body: user,
};

const res = {
  status: jest.fn(() => res),
  json: jest.fn(),
};

describe('login user', () => {
  it('login user successfully', async () => {
    Users.findOne.mockResolvedValue({ email: req.body.email });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockResolvedValue('accessToken');
    await login(req, res);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ accessToken: 'accessToken' });
  });

  it("login user fail because email doesn't exist", async () => {
    Users.findOne.mockResolvedValue(null);
    bcrypt.compare.mockResolvedValue(false);
    try {
      await login(req, res);
    } catch (e) {
      expect(res.status).toHaveBeenCalledWith(401);
      expect(e.message).toBe('email or password is not valid');
    }
  });

  it('login user fail because password is not correct', async () => {
    Users.findOne.mockResolvedValue({ email: req.body.email });
    bcrypt.compare.mockResolvedValue(false);
    try {
      await login(req, res);
    } catch (e) {
      expect(res.status).toHaveBeenCalledWith(401);
      expect(e.message).toBe('email or password is not valid');
    }
  });
});
