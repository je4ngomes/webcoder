const postRoute = require('express').Router();
const validator = require('express-joi-validation')({ passError: true });

const {postSchema, ObjectId} = require('../../validators/post.valid');
const { postsCtrl } = require('../../controllers');

postRoute
    .get('/', postsCtrl.renderTableOfPosts)
    .get('/create', postsCtrl.renderNewPostPage)
    .get('/edit/:id', validator.params(ObjectId), postsCtrl.renderEditPostPage);

postRoute
    .post('/create', validator.body(postSchema), postsCtrl.createNewPost)
    .patch('/edit/:id',[validator.params(ObjectId), validator.body(postSchema)], postsCtrl.updatePost)
    .delete('/del/:id', validator.params(ObjectId), postsCtrl.deletePost);

module.exports = postRoute;