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
const { getMaxListeners } = require("../models/auth.model");
sgMail.setApiKey(process.env.EMAIL_KEY);

exports.registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  console.log("CLIENT URL", process.env.CLIENT_URL);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(200).json({
      error: firstError,
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
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: "15m",
    }
  );

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Account activation link",
    html: `
    <h1>Please use the following to activate your account</h1>
    <p>http://localhost:5000/api/activation/${token}</p>
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
        err: err.response.body,
        error: err,
      });
    });
};

exports.activationController = async (req, res) => {
  const { token } = req.body;

  console.log("CONFIRM", token);

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "Expired Token. Sign Up Again",
        });
      } else {
        const { email, name, password } = jwt.decode(token);
        const user = new User({ email, name, password });

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
