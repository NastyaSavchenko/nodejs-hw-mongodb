import { registerUser, loginUser } from '../services/auth.js';

async function registerController(req, res) {
  const user = await registerUser(req.body);

  return res.status(201).json({
    status: '201',
    message: 'Successfully registered a user!',
    data: user,
  });
}

async function loginController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);

  console.log(session);

  res.json({
    status: '200',
    message: 'Successfully logged in an user!',
    accessToken: session.accessToken,
  });
}

export { registerController, loginController };
