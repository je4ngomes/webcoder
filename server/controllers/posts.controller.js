const moment = require('moment');

const { Article } = require('../models');
const { genPaginationObj } = require('../utils');

const renderTableOfPosts = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = 9;
    const query = {
        skip: size * (page - 1),
        limit: size
    };
    
    const 
        articlesCount = Article.count({ createdBy: req.user.id }),
        articles =  Article.find({ createdBy: req.user.id }, {}, query).sort({_id: -1});

    Promise.all([articlesCount, articles])
        .then(results => {
            const [articlesCount, articles] = results;

            if (!articles) return res.boom.notFound();

            const pagination = genPaginationObj(page, articlesCount);

            res.render('user/posts/posts', {
                articles: articles.map(article => ({
                    id: article._id,
                    image: article.coverPic,
                    title: article.title,
                    createdAt: moment(article.createdAt).format('lll'),
                    status: article.status,
                    allowComments: article.allowComments
                    })),
                pagination
            });
        })
};

const renderNewPostPage = (req, res) => {
    res.render('user/posts/newpost');
};

const renderEditPostPage = (req, res) => {
    Article.findById(req.params.id)
        .then(article => {
            if (!article)
                return res.boom.notFound();

            res.render('user/posts/updatepost', {
                title: article.title,
                body: article.body,
                description: article.description,
                selected: article.status,
                isChecked: article.allowComments
            });     
        });
};

const createNewPost = (req, res) => {
    const body = req.body;

    const article = new Article({
        title: body.postTitle,
        body: body.postBody,
        status: body.status,
        description: body.postDescription,
        coverPic: req.file.cloudStoragePublicUrl,
        coverPicID: req.file.cloudStorageObject,
        allowComments: body.allowComments,
        createdBy: req.user.id
    });
    
    article.save()
        .then(article => {
            if (!article)
                return res.boom.badImplementation();

            res.send({});
        })
        .catch(err => {
            console.error(err);
            res.boom.badImplementation();
        });
};

const updatePost = (req, res) => {
    const body = req.body;
    const toUpdate = {
        title: body.postTitle,
        body: body.postBody,
        status: body.status,
        description: body.postDescription,
        allowComments: body.allowComments
    };

    // if files exists then update it
    if (req.file && req.file.cloudStoragePublicUrl) {
        toUpdate.coverPicID = req.file.cloudStorageObject;
        toUpdate.coverPic = req.file.cloudStoragePublicUrl;
    }

    Article.findByIdAndUpdate(
        req.params.id, 
        {$set: toUpdate}
    ).then(article => {
        if (!article)
            return res.boom.badImplementation();
        
        res.send({});
    })
    .catch(err => {
        console.error(err);
        res.boom.badImplementation();
    });
        
};

const deletePost = (req, res) => {
    Article.findByIdAndRemove(req.params.id)
        .then(doc => {
            if (!doc)
                return res.boom.notFound();
            res.send({});
        })
        .catch(err => {
            console.error(err);
            res.boom.badImplementation();
        });
};

module.exports = {
    renderNewPostPage,
    renderEditPostPage,
    renderTableOfPosts,
    createNewPost,
    updatePost,
    deletePost
};