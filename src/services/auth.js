import * as fs from 'node:fs';
import path from 'node:path';

import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

import Session from '../models/session.js';
import { User } from '../models/user.js';
import { sendMail } from '../utils/sendMail.js';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'reset-password.hbs'),
  'UTF-8',
);

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

  await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  return Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
}

async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (!session) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Invalid refresh token');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
}

async function requestResetPassword(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw new createHttpError.NotFound('User not found');
  }

  const html = Handlebars.compile(RESET_PASSWORD_TEMPLATE);

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  );

  try {
    await sendMail(
      user.email,
      'Reset password',
      html({
        link: `${process.env.APP_DOMAIN}/reset-password/?token=${token}`,
      }),
    );
  } catch (err) {
    console.log(err);
    throw new createHttpError.InternalServerError(
      'Failed to send the email, please try again later.',
    );
  }
}

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetPassword,
};
