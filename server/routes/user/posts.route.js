const postRoute = require('express').Router();
const validator = require('express-joi-validation')({ passError: true });

const images = require('../../lib/images');
const {postSchema, ObjectId} = require('../../validators/post.valid');
const { postsCtrl } = require('../../controllers');

postRoute
    .get('/', postsCtrl.renderTableOfPosts)
    .get('/create', postsCtrl.renderNewPostPage)
    .get('/edit/:id', validator.params(ObjectId), postsCtrl.renderEditPostPage);


postRoute
    .post('/create', [
        images.multer.single('coverPhoto'),
        images.sendUploadToGCS,
        validator.body(postSchema) 
    ], postsCtrl.createNewPost)

    .put('/edit/:id',[
        validator.params(ObjectId),
        images.multer.single('coverPhoto'),
        images.sendUploadToGCS,
        images.deleteOldFileFromGCS,
        validator.body(postSchema)
    ], postsCtrl.updatePost)

    .delete('/del/:id', [validator.params(ObjectId), images.deleteOldFileFromGCS], postsCtrl.deletePost);

module.exports = postRoute;