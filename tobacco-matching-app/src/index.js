require('dotenv').config();
const { App } = require('@slack/bolt');

const registerTabakoCommand = require('./commands/tabako');
const registerJoinCommand = require('./commands/join');
const registerLeaveCommand = require('./commands/leave');
const registerMembersCommand = require('./commands/members');

const registerJoinAction = require('./actions/joinBreak');
const registerLaterAction = require('./actions/later');
const registerReadyAction = require('./actions/ready');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
});

registerTabakoCommand(app);
registerJoinCommand(app);
registerLeaveCommand(app);
registerMembersCommand(app);

registerJoinAction(app);
registerLaterAction(app);
registerReadyAction(app);

(async () => {
  await app.start();
  console.log('⚡️ タバコ休憩マッチングアプリが起動しました');
})();
