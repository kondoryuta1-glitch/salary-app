const store = require('../store');
const { isExpired, confirmJoin, replyClosed } = require('../helpers');

module.exports = function registerJoinAction(app) {
  app.action('break_join', async ({ ack, body, client, action }) => {
    await ack();

    const requestId = action.value;
    const userId = body.user.id;
    const request = store.getRequest(requestId);

    if (!request || request.status !== 'open' || isExpired(request)) {
      await replyClosed(client, request, body);
      return;
    }

    await confirmJoin(client, request, userId);
  });
};
