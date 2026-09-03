const store = require('../store');
const { isExpired, getDisplayName } = require('../helpers');
const { laterMessage, joinedText, closedText, selfActionText } = require('../messages');

function parseData(data) {
  return Object.fromEntries(new URLSearchParams(data));
}

// 「行く」または「今なら行けます」共通のマッチング確定処理
async function confirmJoin(client, source, replyToken, request, userId) {
  const name = await getDisplayName(client, source, userId);

  if (!request.matched.includes(userId)) request.matched.push(userId);
  request.later = request.later.filter((id) => id !== userId);
  store.updateRequest(request.id, request);

  const matchedNames = await Promise.all(
    request.matched.map((id) => getDisplayName(client, source, id))
  );

  await client.replyMessage({
    replyToken,
    messages: [joinedText({ name, matchedNames })],
  });
}

async function handlePostbackEvent(client, event) {
  const { action, requestId } = parseData(event.postback.data);
  const { source, replyToken } = event;
  const userId = source.userId;
  const request = store.getRequest(requestId);

  if (!request || request.status !== 'open' || isExpired(request)) {
    await client.replyMessage({ replyToken, messages: [closedText()] });
    return;
  }

  if (userId === request.requesterId) {
    await client.replyMessage({ replyToken, messages: [selfActionText()] });
    return;
  }

  if (action === 'join' || action === 'ready') {
    await confirmJoin(client, source, replyToken, request, userId);
    return;
  }

  if (action === 'later') {
    if (!request.later.includes(userId)) request.later.push(userId);
    store.updateRequest(requestId, request);

    const name = await getDisplayName(client, source, userId);
    await client.replyMessage({
      replyToken,
      messages: [laterMessage({ name, requestId })],
    });
  }
}

module.exports = { handlePostbackEvent };
