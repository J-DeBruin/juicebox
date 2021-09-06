const { Client } = require('pg'); 
const client = new Client('postgres://localhost:5432/juicebox-dev');

// = = = = = = = = = CREATE USER (createUser) = = = = = = = = = = = = = = = *
async function createUser({ 
  username, 
  password,
  name,
  location
 }) {
  try {
    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(username, password, name, location) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password, name, location]);

    return user;
  } catch (error) {
    throw error;
  }
}

// = = = = = = = = = CREATE POST (createPost) = = = = = = = = = = = = = = = 
async function createPost({ 
  authorId,
  title,
  content
 }) {
  try {
    const { rows: [ post ] } = await client.query(`
      INSERT INTO posts("authorId", title, content) 
      VALUES($1, $2, $3) 
      ON CONFLICT ("authorId") DO NOTHING 
      RETURNING *;
    `, [authorId, title, content]);

    return post;
  } catch (error) {
    throw error;
  }
};

// = = = = = = = = = GET ALL USERS (getAllUsers) = = = = = = = = = = = = = *
async function getAllUsers() {
  try {
    const { rows } = await client.query(
      `SELECT id, username, name, location, active 
      FROM users;
    `);
    return rows;  
  } catch (error) {
      throw error;
  }
};

// = = = = = = = = GET ALL POSTS (getAllPosts) = = = = = = = = = = = = = =
async function getAllPosts() {
  try {
    const { rows } = await client.query(
      `SELECT id 
      FROM posts;
    `);
    const posts = await Promise.all(rows.map(row => getPostById(row.id)))
    return posts;
  } catch (error) {
    console.log(" error getting all posts. . . ")
    throw error;
  }
};

// = = = = = = = = UPDATE USER (updateUser) = = = = = = = = = = = = = = =
async function updateUser(id, fields = {}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
  if (setString.length === 0) {
    return;
  }
//potentially where hte issue is?
  try {
    const {rows: [ user ]} = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return user;
  } catch (error) {
    throw error;
  }
}

// = = = = = = = = = UPDATE POST (updatePost) = = = = = = = = = = = = = = issue?
async function updatePost(id, fields = {
  title,
  content,
  active
}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
  if (setString.length === 0) {
    return;
  }

  try {
    const {rows: [ post ]} = await client.query(`
      UPDATE posts
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return post;
  } catch (error) {
    throw error;
  }
}

// = = = = = = = = = = GET POSTS BY USERS (getPostsByUser) = = = = = = = = = *
async function getPostsByUser(userId) {
  try {
    const { rows } = client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${ userId };
    `);

    return rows;
  } catch (error) {
    throw error;
  }
};

// = = = = = = = = = = GET USER BY ID (getUserById) = = = = = = = = = = = = *
async function getUserById(userId) {
  console.log(userId);
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM users
    WHERE "id"=${userId};
    `);
    delete user.password
    console.log("here?");
    const posts = await getPostsByUser(userId)
    user.posts = posts;
    return user
  } catch (error) {
    throw error;
  }
};
 
module.exports = {
  client,
  createUser,
  createPost,
  getAllUsers,
  getAllPosts,
  updateUser,
  updatePost,
  getUserById,
}