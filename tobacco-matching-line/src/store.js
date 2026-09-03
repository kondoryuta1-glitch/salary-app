const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { requests: {} };
  }
}

function save(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

const db = load();

module.exports = {
  createRequest(request) {
    db.requests[request.id] = request;
    save(db);
    return request;
  },

  getRequest(id) {
    return db.requests[id];
  },

  updateRequest(id, patch) {
    if (!db.requests[id]) return null;
    Object.assign(db.requests[id], patch);
    save(db);
    return db.requests[id];
  },
};
