const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://lajnaoda:8oarL9XdLW4BtGiv1Or1aooJ-EcLmG-i@raja.db.elephantsql.com/lajnaoda",

  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { pool };
