function inviteBlocks({ requesterId, requestId, status }) {
  const blocks = [
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `🚬 <@${requesterId}> さんがタバコ休憩に誘っています！` },
    },
  ];

  if (status === 'pending') {
    blocks.push({
      type: 'actions',
      block_id: 'tabako_invite_actions',
      elements: [
        {
          type: 'button',
          style: 'primary',
          text: { type: 'plain_text', text: '🚬 行く', emoji: true },
          action_id: 'break_join',
          value: requestId,
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: '🕓 あとで', emoji: true },
          action_id: 'break_later',
          value: requestId,
        },
      ],
    });
  } else if (status === 'joined') {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: '✅ 参加しました！' }],
    });
  } else if (status === 'later') {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: '🕓 後で行くと伝えました（会議中など）' }],
    });
    blocks.push({
      type: 'actions',
      block_id: 'tabako_ready_actions',
      elements: [
        {
          type: 'button',
          style: 'primary',
          text: { type: 'plain_text', text: '🚬 今なら行けます！', emoji: true },
          action_id: 'break_ready',
          value: requestId,
        },
      ],
    });
  } else if (status === 'closed') {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: 'このお誘いは終了しました' }],
    });
  }

  return blocks;
}

function requesterStatusBlocks({ invited, matched, later }) {
  const lines = [`🚬 タバコ休憩のお誘いを送信しました！（対象 ${invited.length}人）`];

  if (matched.length) {
    lines.push(`✅ 参加: ${matched.map((id) => `<@${id}>`).join(' ')}`);
  }
  if (later.length) {
    lines.push(`🕓 あとで: ${later.map((id) => `<@${id}>`).join(' ')}`);
  }

  const waiting = invited.filter((id) => !matched.includes(id) && !later.includes(id));
  if (waiting.length) {
    lines.push(`⏳ 返信待ち: ${waiting.map((id) => `<@${id}>`).join(' ')}`);
  }

  return [{ type: 'section', text: { type: 'mrkdwn', text: lines.join('\n') } }];
}

module.exports = { inviteBlocks, requesterStatusBlocks };
