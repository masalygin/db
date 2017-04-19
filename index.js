const mysql = require('mysql');

class Db {

  static prepare(rows, fields) {
    return rows;
  }

  static format(sql, params) {
    if (!params) {
      return sql;
    }
    return sql.replace(/\:(\w+)/g, function (string, key) {
      if (params.hasOwnProperty(key)) {
        return mysql.escape(params[key]);
      }
      return string;
    });
  }

  constructor(options) {
    this.pool = mysql.createPool(options);
  }

  query(sql, params, prepare = Db.prepare) {
    return new Promise((resolve, reject) => {
      this.pool.query(Db.format(sql, params), (error, rows, fields) => {
        if (error) {
          return reject(error);
        }
        resolve(prepare(rows, fields));
      });
    });
  }

  one(sql, params) {
    return this.query(sql, params, (rows) => rows[0]);
  }

  column(sql, params) {
    return this.query(sql, params, (rows, fields) => {
      const name = fields[0].name;
      return rows.map(row => row[name]);
    });
  }

  hash(sql, params) {
    return this.query(sql, params, (rows, fields) => {
      const key = fields[0].name;
      const value = fields[1].name;
      const res = {};
      rows.forEach(row => {
        res[row[key]] = row[value]
      });
      return res;
    })
  }
}

module.exports = Db;
