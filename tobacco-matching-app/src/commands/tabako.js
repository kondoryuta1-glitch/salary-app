const crypto = require('crypto');
const store = require('../store');
const { inviteBlocks, requesterStatusBlocks } = require('../blocks');

module.exports = function registerTabakoCommand(app) {
  app.command('/tabako', async ({ ack, body, client, respond }) => {
    await ack();

    const teamId = body.team_id;
    const requesterId = body.user_id;
    const members = store.getMembers(teamId).filter((id) => id !== requesterId);

    if (members.length === 0) {
      await respond({
        response_type: 'ephemeral',
        text: '一緒にタバコ休憩する仲間がまだ登録されていません。`/tabako-join` で仲間を増やしましょう！',
      });
      return;
    }

    const requestId = crypto.randomUUID();
    const request = {
      id: requestId,
      teamId,
      requesterId,
      createdAt: Date.now(),
      invited: members,
      matched: [],
      later: [],
      status: 'open',
      dmTs: {},
      requesterTs: null,
    };

    for (const userId of members) {
      const im = await client.conversations.open({ users: userId });
      const channel = im.channel.id;
      const msg = await client.chat.postMessage({
        channel,
        text: `🚬 <@${requesterId}> さんがタバコ休憩に誘っています！`,
        blocks: inviteBlocks({ requesterId, requestId, status: 'pending' }),
      });
      request.dmTs[userId] = { channel, ts: msg.ts };
    }

    const requesterIm = await client.conversations.open({ users: requesterId });
    const statusMsg = await client.chat.postMessage({
      channel: requesterIm.channel.id,
      text: '🚬 タバコ休憩のお誘いを送信しました！',
      blocks: requesterStatusBlocks({ invited: members, matched: [], later: [] }),
    });
    request.requesterTs = { channel: requesterIm.channel.id, ts: statusMsg.ts };

    store.createRequest(request);

    await respond({
      response_type: 'ephemeral',
      text: `🚬 誘いを送信しました！（対象 ${members.length}人）`,
    });
  });
};
