const crypto = require('crypto');
const store = require('../store');
const { getDisplayName, sourceTarget } = require('../helpers');
const { inviteMessage, needsGroupText } = require('../messages');

const TRIGGER_WORDS = new Set(['タバコ', 'たばこ', 'タバコ休憩', '🚬', 'tabako', '/tabako']);

async function handleMessageEvent(client, event) {
  if (event.message.type !== 'text') return;

  const text = event.message.text.trim();
  if (!TRIGGER_WORDS.has(text)) return;

  const { source, replyToken } = event;

  if (source.type === 'user') {
    await client.replyMessage({ replyToken, messages: [needsGroupText()] });
    return;
  }

  const requesterId = source.userId;
  const requesterName = await getDisplayName(client, source, requesterId);
  const requestId = crypto.randomUUID();

  store.createRequest({
    id: requestId,
    sourceType: source.type,
    sourceId: sourceTarget(source),
    requesterId,
    requesterName,
    createdAt: Date.now(),
    matched: [],
    later: [],
    status: 'open',
  });

  await client.replyMessage({
    replyToken,
    messages: [inviteMessage({ requesterName, requestId })],
  });
}

module.exports = { handleMessageEvent };
