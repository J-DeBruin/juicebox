const express = require('express');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next(); // THIS IS DIFFERENT
});
const { getAllTags, getAllTags, getPostById } = require('../db');

// UPDATE
tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  try {
    // use our method to get posts by tag name from the db
    // send out an object to the client { posts: // the posts }
    const allTags = await getPostById();

    const tags = allTags.filter(tag => {
      return tag.active || (req.user)
    })
  } catch ({ name, message }) {
    // forward the name and message to the error handler
  }
});


// = = = = = = = = = = = = MODULE EXPORTS = = = = = = = = = = = = = = = = = = 
module.exports = tagsRouter;