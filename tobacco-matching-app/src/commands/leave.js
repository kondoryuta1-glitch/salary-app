const store = require('../store');

module.exports = function registerLeaveCommand(app) {
  app.command('/tabako-leave', async ({ ack, body, respond }) => {
    await ack();
    store.removeMember(body.team_id, body.user_id);
    await respond({
      response_type: 'ephemeral',
      text: '👋 タバコ休憩グループから抜けました。今後お誘いは届きません。',
    });
  });
};
