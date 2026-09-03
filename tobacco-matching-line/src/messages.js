function inviteMessage({ requesterName, requestId }) {
  const text = `🚬 ${requesterName}さんがタバコ休憩に誘っています！`;
  return {
    type: 'template',
    altText: text,
    template: {
      type: 'buttons',
      text: text.slice(0, 160),
      actions: [
        {
          type: 'postback',
          label: '🚬 行く',
          data: `action=join&requestId=${requestId}`,
          displayText: '🚬 行きます！',
        },
        {
          type: 'postback',
          label: '🕓 あとで',
          data: `action=later&requestId=${requestId}`,
          displayText: '🕓 後で行きます',
        },
      ],
    },
  };
}

// 「あとで」を選んだ人にも見える、いつでも押せる「今なら行けます」ボタン付きメッセージ
function laterMessage({ name, requestId }) {
  const text = `🕓 ${name}さんは今忙しいみたいです（会議中など）。落ち着いたらボタンを押してね。`;
  return {
    type: 'template',
    altText: text,
    template: {
      type: 'buttons',
      text: text.slice(0, 160),
      actions: [
        {
          type: 'postback',
          label: '🚬 今なら行けます！',
          data: `action=ready&requestId=${requestId}`,
          displayText: '🚬 今なら行けます！',
        },
      ],
    },
  };
}

function joinedText({ name, matchedNames }) {
  const suffix = matchedNames.length > 1 ? `（参加: ${matchedNames.join('、')}）` : '';
  return { type: 'text', text: `✅ ${name}さんが参加します！${suffix}` };
}

function closedText() {
  return {
    type: 'text',
    text: 'このお誘いは終了しました（期限切れ、または既に終了しています）。',
  };
}

function selfActionText() {
  return { type: 'text', text: 'あなたが誘った本人です。他の人の参加を待ちましょう！' };
}

function needsGroupText() {
  return {
    type: 'text',
    text: 'このコマンドは同僚と一緒にいるグループチャット・複数人トークで使ってね🚬',
  };
}

module.exports = {
  inviteMessage,
  laterMessage,
  joinedText,
  closedText,
  selfActionText,
  needsGroupText,
};
