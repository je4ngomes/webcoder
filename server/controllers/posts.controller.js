const moment = require('moment');
const { Article } = require('../models');

const renderTableOfPosts = (req, res) => {
    const pag = parseInt(req.query.page) || 1;
    const size = 10;
    const query = {
        skip: size * (pag - 1),
        limit: size
    };
    
    Article.count({ createdBy: req.user.id })
        .then(totalCounts => {            
            const pageLimit = Math.floor(totalCounts / size);
            const limit = pageLimit ? pageLimit : 1;
            const pagination = {
                current: pag,
                limit,
                prev: pag === 1 ? null : (pag - 1),
                next: pag === limit ? null : (pag + 1)
            };
            
            Article.find({ createdBy: req.user.id }, {}, query)
                .then(articles => {
                    if (!articles) return res.boom.notFound();

                    res.render('user/posts/posts', {
                        articles: articles.map(article => ({
                            id: article._id,
                            title: article.title,
                            createdAt: moment(article.createdAt).format('L'),
                            status: article.status,
                            allowComments: article.allowComments
                            })),
                        pagination,
                        firstname: req.user.firstname,
                        lastname: req.user.lastname
                    });
                });
        });
};

const renderNewPostPage = (req, res) => {
    res.render('user/posts/newpost', {
        firstname: req.user.firstname,
        lastname: req.user.lastname
    });
};

const renderEditPostPage = (req, res) => {
    Article.findById(req.params.id)
        .then(article => {
            if (!article)
                return res.boom.notFound();

            res.render('user/posts/updatepost', {
                title: article.title,
                body: article.body,
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
        allowComments: body.allowComments,
        createdAt: Date.now(),
        createdBy: req.user.id
    });

    article.save()
        .then(post => {
            if (!post)
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
        allowComments: body.allowComments
    };
    Article.findByIdAndUpdate(
        req.params.id, 
        {$set: toUpdate}
    ).then(post => {
        if (!post)
            return res.boom.badImplementation();
        
        res.send({});
    })
    .catch(err => {
        console.error(err);
        res.boom.badImplementation();
    });
        
};

const deletePost = (req, res) => {

};

module.exports = {
    renderNewPostPage,
    renderEditPostPage,
    renderTableOfPosts,
    createNewPost,
    updatePost,
    deletePost
};