const User = require('../models/auth.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');

// Mailer client
const sgMail = require('@sendgrid/mail');

//Custom error handler to get useful error from database errors
const { errorHandler } = require('../helpers/dbErrorHandling');

exports.registerController = async (req, res) => {
  const { name, email, password } = req.body;

  res.json({ name, email, password });
};
