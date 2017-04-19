```js
const Db = require('db');
const db = new Db({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db'
});

async function getUserById(id) {
  const user = await db.one('SELECT * FROM users WHERE id = :id', {id});
  // ...
  return user;
}

```
