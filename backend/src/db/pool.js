const { Pool, types } = require('pg');

// Keep DATE columns as plain "YYYY-MM-DD" strings instead of JS Date objects,
// which avoids timezone-shift bugs when serializing to JSON.
types.setTypeParser(types.builtins.DATE, (val) => val);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
