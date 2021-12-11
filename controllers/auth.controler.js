const User = require('../models/auth.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
require('dotenv').config({ path: './config/config.env' });

//Custom error handler to get useful error from database errors
const { errorHandler } = require('../helpers/dbErrorHandling');

// Mailer client
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);

exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors
      .array()
      .map((error) => error.param + ' ' + error.msg)[0];
    return res.status(422).json({
      message: firstError,
      error: errors,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          errors: 'Email is taken',
        });
      }
    });

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
      to: email,
      subject: 'Account activation link',
      html: `
                <h1>Please use the following to activate your account</h1>
                <p>${process.env.CLIENT_URL}/users/activation/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };

    sgMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          errors: errorHandler(err),
        });
      });
  }
};

exports.activationController = (req, res) => {
  const { token } = req.body;

  const decodedToken = jwt.decode(token, process.env.JWT_ACCOUNT_ACTIVATION);
  const verifiedToken = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          errors: 'Expired link. Signup again',
        });
      } else {
        const { name, email, password } = jwt.decode(token);

        const user = new User({
          name,
          email,
          password,
        });

        user.save((err, user) => {
          if (err) {
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              message: user,
              message: 'Signup success',
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: 'error happening please try again',
    });
  }
};

exports.loginController = async (req, res) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(200).json({
        firstEror: firstError,
        err: errors,
      });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({
        message: "User with thie email doesn't exist",
      });
    }

    const auth = await user.authenticate(req.body.password);
    if (!auth) {
      return res.status(400).json({
        message: 'Wrong credential, try again or register first',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: 'User with this email does not exists. Please sign up first',
      error: error.message,
    });
  }
};

exports.forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      firstEror: firstError,
      err: errors,
    });
  } else {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          message: 'User with this email does not exist',
          error: new Error('User with this email does not exist'),
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_RESET_PASSWORD,
        {
          expiresIn: '50m',
        }
      );

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password reset link',
        html: `
                      <h1>Please use the following to reset your pasword</h1>
                      <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                      <hr />
                      <p>This email may containe sensetive information</p>
                      <p>${process.env.CLIENT_URL}</p>
                  `,
      };

      const updatedUserLink = await user.updateOne({
        resetPasswordLink: token,
      });

      sgMail
        .send(emailData)
        .then((sent) => {
          return res.json({
            message: `Email has been sent to ${email}. Follow the instructions to activate your account`,
          });
        })
        .catch((err) => {
          return res.json({
            message: errorHandler(err),
          });
        });
    } catch (error) {
      return res.status(404).json({
        message: 'Sth wrong try again',
        err: error,
      });
    }
  }
};

exports.resetPasswordController = async (req, res) => {
  try {
    const { resetPasswordLink, newPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        firstEror: firstError,
        err: errors,
      });
    } else {
      if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD);

        let user = await User.findOne({ resetPasswordLink });
        user.resetPassword(newPassword);
        await user.save();

        return res.status(200).json({
          message: 'Greate, now you can login with your new credentials',
        });
      }
    }
  } catch (error) {
    return res.status(401).json({
      err: error,
      message: error.message,
    });
  }
};
