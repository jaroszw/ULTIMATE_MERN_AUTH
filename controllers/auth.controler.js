const User = require('../models/auth.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');

// Mailer client
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.MAIL_KEY);

//Custom error handler to get useful error from database errors
const { errorHandler } = require('../helpers/dbErrorHandling');

exports.registerController = async (req, res) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(200).json({
      error: firstError,
    });
  } else {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        error: 'Email is taken',
      });
    }
  }

  const token = jwt.sign(
    {
      name,
      email,
      password,
    },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: '15m',
    }
  );

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Account activation link',
    html: `
      <h1>Pleace click to link to activate</h1>
      <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
      <hr/>
      <p>This email contain sensitive info</p>
      <p>${process.env.CLIENT_URL}</p>
    `,
  };
};
