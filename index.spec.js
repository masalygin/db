const Db = require('./index');
const db = new Db({
  connectionLimit: 1,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_test'
});


beforeAll(async () => {
  await db.query(`
    DROP TABLE IF EXISTS users
  `);

  await db.query(`
    CREATE TABLE users
    (
      id   INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      UNIQUE (id)
    )
  `);

  await db.query(`
    INSERT INTO users (id, name) VALUES (1, 'John'), (2, 'Johan'), (3, 'Jane')
  `);

});


it('Db.format', () => {
  expect(Db.format(`SELECT id, name FROM users WHERE id = :id`, {id: 1}))
    .toBe(`SELECT id, name FROM users WHERE id = 1`);
  expect(Db.format(`SELECT id, name FROM users WHERE name = :name`, {name: 'John'}))
    .toBe(`SELECT id, name FROM users WHERE name = 'John'`);
});


it('Db#query', async () => {
  const rows = await db.query(`SELECT id, name FROM users WHERE id = :id`, {id: 1});
  expect(rows).toEqual([{name: 'John', id: 1}])
});


it('Db#one', async () => {
  const row = await db.one(`SELECT id, name FROM users WHERE id = :id`, {id: 1});
  expect(row).toEqual({name: 'John', id: 1})
});


it('Db#column', async () => {
  const column = await db.column(`SELECT id, name FROM users ORDER BY id`);
  expect(column).toEqual([1, 2, 3])
});


it('Db#hash', async () => {
  const hash = await db.hash(`SELECT id, name FROM users`);
  expect(hash).toEqual({
    1: 'John',
    2: 'Johan',
    3: 'Jane'
  })
});
