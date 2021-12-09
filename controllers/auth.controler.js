const User = require("../models/auth.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
require("dotenv").config();

//Custom error handler to get useful error from database errors
const { errorHandler } = require("../helpers/dbErrorHandling");

// Mailer client
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.EMAIL_KEY);

exports.registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(200).json({
      firstEror: firstError,
      err: errors,
    });
  } else {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
  }

  const token = jwt.sign(
    {
      name,
      email,
      password,
    },
    process.env.JWT_ACCOUNT_ACTIVATION
    // {
    //   expiresIn: "15m",
    // }
  );

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Account activation link",
    html: `
    <h1>Please use the following to activate your account</h1>
    <p>http://localhost:3000/user/activation/${token}</p>
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
};

exports.activationController = async (req, res) => {
  const { token } = req.body;
  console.log("FROM CONTROLLER", "activation");
  console.log(token);

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "Expired Token. Sign Up Again",
        });
      } else {
        const { email, name, password } = jwt.decode(token);
        const user = new User({ name, password, email });

        user.save((err, user) => {
          if (err) {
            return res.status(401).json({
              error: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              message: "Sign up success",
              user: user,
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "error happening please try again",
    });
  }
};

exports.loginController = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(200).json({
      firstEror: firstError,
      err: errors,
    });
  } else {
    User.findOne({ email }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: "User with this email does not exists. Please sign up first",
          error: err,
        });
      }

      if (!user.authenticate(password)) {
        return res.status(400).json({
          message: "Failed credentials",
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
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
    });
  }
};
