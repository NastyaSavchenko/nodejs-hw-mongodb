import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetPassword,
} from '../services/auth.js';

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

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: '200',
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
}

async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: '200',
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
}

async function logoutController(req, res) {
  const sessionId = req.cookies.sessionId;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
}

async function requestResetPasswordController(req, res) {
  const { email } = req.body;
  await requestResetPassword(email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

export {
  registerController,
  loginController,
  refreshController,
  logoutController,
  requestResetPasswordController,
};
