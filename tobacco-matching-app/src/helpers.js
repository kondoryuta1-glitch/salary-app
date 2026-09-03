const store = require('./store');
const { inviteBlocks, requesterStatusBlocks } = require('./blocks');

const REQUEST_TTL_MS = Number(process.env.REQUEST_TTL_MINUTES || 20) * 60 * 1000;

function isExpired(request) {
  return Date.now() - request.createdAt > REQUEST_TTL_MS;
}

async function updateRequesterStatus(client, request) {
  if (!request.requesterTs) return;
  await client.chat.update({
    channel: request.requesterTs.channel,
    ts: request.requesterTs.ts,
    text: 'タバコ休憩のお誘い状況',
    blocks: requesterStatusBlocks({
      invited: request.invited,
      matched: request.matched,
      later: request.later,
    }),
  });
}

// 「行く」または「今なら行けます」が押されたときの共通処理
async function confirmJoin(client, request, userId) {
  if (!request.matched.includes(userId)) request.matched.push(userId);
  request.later = request.later.filter((id) => id !== userId);
  store.updateRequest(request.id, request);

  const dm = request.dmTs[userId];
  if (dm) {
    await client.chat.update({
      channel: dm.channel,
      ts: dm.ts,
      text: '✅ 参加しました！',
      blocks: inviteBlocks({ requesterId: request.requesterId, requestId: request.id, status: 'joined' }),
    });
  }

  await updateRequesterStatus(client, request);

  if (request.requesterTs && request.requesterId !== userId) {
    await client.chat.postMessage({
      channel: request.requesterTs.channel,
      text: `✅ <@${userId}> さんとタバコマッチしました！`,
    });
  }
}

// 「あとで」が押されたときの処理
async function markLater(client, request, userId) {
  if (!request.later.includes(userId)) request.later.push(userId);
  store.updateRequest(request.id, request);

  const dm = request.dmTs[userId];
  if (dm) {
    await client.chat.update({
      channel: dm.channel,
      ts: dm.ts,
      text: '🕓 後で行くと伝えました',
      blocks: inviteBlocks({ requesterId: request.requesterId, requestId: request.id, status: 'later' }),
    });
  }

  await updateRequesterStatus(client, request);

  if (request.requesterTs) {
    await client.chat.postMessage({
      channel: request.requesterTs.channel,
      text: `🕓 <@${userId}> さんは今忙しいみたいです（会議中など）。また後で行けそうなら教えてくれるそうです。`,
    });
  }
}

// お誘いが見つからない/期限切れのときにボタンを押した相手への表示
async function replyClosed(client, request, body) {
  await client.chat.update({
    channel: body.channel.id,
    ts: body.message.ts,
    text: 'このお誘いは終了しました',
    blocks: inviteBlocks({
      requesterId: request ? request.requesterId : '',
      requestId: request ? request.id : '',
      status: 'closed',
    }),
  });
}

module.exports = {
  REQUEST_TTL_MS,
  isExpired,
  updateRequesterStatus,
  confirmJoin,
  markLater,
  replyClosed,
};
