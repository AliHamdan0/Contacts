const { currentUser } = require('../../controllers/userController');
const validateToken = require('../../middlewares/validateTokenHandler');
const res = {
  status: jest.fn(() => res),
  json: jest.fn(),
};

describe("User's info", () => {
  it('get data successfully', async () => {
    const req = {
      user: {
        _id: '123',
        username: 'ali',
        email: 'ali@gmail.com',
      },
    };
    await currentUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(req.user);
  });

  it('get data failure because of token', async () => {
    const req = {};
    try {
      await validateToken(req, res);
    } catch (e) {
      expect(res.status).toHaveBeenCalledWith(401);
    }
  });
});
