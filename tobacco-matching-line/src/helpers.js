const REQUEST_TTL_MS = Number(process.env.REQUEST_TTL_MINUTES || 20) * 60 * 1000;

function isExpired(request) {
  return Date.now() - request.createdAt > REQUEST_TTL_MS;
}

// グループ/複数人トーク/1対1トークのいずれでも表示名を取得する
async function getDisplayName(client, source, userId) {
  try {
    if (source.type === 'group') {
      const profile = await client.getGroupMemberProfile(source.groupId, userId);
      return profile.displayName;
    }
    if (source.type === 'room') {
      const profile = await client.getRoomMemberProfile(source.roomId, userId);
      return profile.displayName;
    }
    const profile = await client.getProfile(userId);
    return profile.displayName;
  } catch {
    return 'だれか';
  }
}

// トークの送信先ID(グループ/複数人トーク/個人)を取り出す
function sourceTarget(source) {
  if (source.type === 'group') return source.groupId;
  if (source.type === 'room') return source.roomId;
  return source.userId;
}

module.exports = { REQUEST_TTL_MS, isExpired, getDisplayName, sourceTarget };
