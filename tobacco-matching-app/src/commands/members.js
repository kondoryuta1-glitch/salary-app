const store = require('../store');

module.exports = function registerMembersCommand(app) {
  app.command('/tabako-members', async ({ ack, body, respond }) => {
    await ack();
    const members = store.getMembers(body.team_id);

    if (members.length === 0) {
      await respond({
        response_type: 'ephemeral',
        text: 'まだ誰もグループに参加していません。`/tabako-join` で参加できます。',
      });
      return;
    }

    const list = members.map((id) => `• <@${id}>`).join('\n');
    await respond({
      response_type: 'ephemeral',
      text: `🚬 タバコ休憩グループのメンバー（${members.length}人）:\n${list}`,
    });
  });
};
