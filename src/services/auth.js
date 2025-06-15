import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import Session from '../models/session.js';

async function registerUser(newUser) {
  const user = await User.findOne({ email: newUser.email });
  if (user) {
    throw new createHttpError.Conflict('Email in use');
  }

  newUser.password = await bcrypt.hash(newUser.password, 10);
  return User.create(newUser);
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new createHttpError.Unauthorized('Incorrect email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new createHttpError.Unauthorized('Incorrect email or password');
  }

  return Session.create({
    userId: user._id,
    token: 'generateToken()',
    accessToken: 'accessToken',
    refreshToken: 'enerateRefreshToken()',
    accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export { registerUser, loginUser };
