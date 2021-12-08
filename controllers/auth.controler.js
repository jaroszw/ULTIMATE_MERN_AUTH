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

// Mailer client
const { errorHandler } = require("../helpers/dbErrorHandling");
const sgMail = require("@sendgrid/mail");
const { getMaxListeners } = require("../models/auth.model");
sgMail.setApiKey(process.env.EMAIL_KEY);

console.log("EMAIL_KEY", process.env.EMAIL_KEY);
console.log("PORT", process.env.PORT);

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
    <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
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
      });
    });
};
