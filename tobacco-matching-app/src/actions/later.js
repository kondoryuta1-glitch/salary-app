const store = require('../store');
const { isExpired, markLater, replyClosed } = require('../helpers');

module.exports = function registerLaterAction(app) {
  app.action('break_later', async ({ ack, body, client, action }) => {
    await ack();

    const requestId = action.value;
    const userId = body.user.id;
    const request = store.getRequest(requestId);

    if (!request || request.status !== 'open' || isExpired(request)) {
      await replyClosed(client, request, body);
      return;
    }

    await markLater(client, request, userId);
  });
};
