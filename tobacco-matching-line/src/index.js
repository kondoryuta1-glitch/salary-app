require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');

const { handleMessageEvent } = require('./handlers/message');
const { handlePostbackEvent } = require('./handlers/postback');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken,
});

const app = express();

app.get('/', (_req, res) => {
  res.send('🚬 タバコ休憩マッチングBot (LINE) is running');
});

app.post('/webhook', line.middleware(config), async (req, res) => {
  // LINEの再送を防ぐため先に200を返し、イベント処理は非同期で行う
  res.status(200).end();

  const events = req.body.events || [];
  for (const event of events) {
    try {
      if (event.type === 'message') {
        await handleMessageEvent(client, event);
      } else if (event.type === 'postback') {
        await handlePostbackEvent(client, event);
      }
    } catch (err) {
      console.error('イベント処理でエラーが発生しました:', err);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`⚡️ タバコ休憩マッチングBot (LINE) がポート${PORT}で起動しました`);
});
