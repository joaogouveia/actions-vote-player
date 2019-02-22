'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow
  } = require('actions-on-google');
const {votingMatchIntent} = require('./vote/vote.context');
const {commonMatchIntent} = require('./common/common.context');
  
// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});
  
app.intent('player_list', votingMatchIntent);
app.intent('vote_player', votingMatchIntent);
app.intent('player_result', votingMatchIntent);
app.intent('vote_result', votingMatchIntent);
app.intent('actions_intent_NO_INPUT', commonMatchIntent);

exports.app = app;