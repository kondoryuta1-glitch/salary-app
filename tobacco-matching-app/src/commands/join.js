const store = require('../store');

module.exports = function registerJoinCommand(app) {
  app.command('/tabako-join', async ({ ack, body, respond }) => {
    await ack();
    store.addMember(body.team_id, body.user_id);
    await respond({
      response_type: 'ephemeral',
      text: '🚬 タバコ休憩グループに参加しました！これで `/tabako` のお誘いが届くようになります。',
    });
  });
};
