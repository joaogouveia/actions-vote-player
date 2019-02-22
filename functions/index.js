'use strict';

// Import the firebase-functions package for deployment.
global.functions = require('firebase-functions');
const admin = require('firebase-admin');
global.admin = admin.initializeApp(functions.config().firebase);

const {app} = require('./app/app');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);