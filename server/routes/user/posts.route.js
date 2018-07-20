const postRoute = require('express').Router();
const validator = require('express-joi-validation')({ passError: true });
const randomString = require('randomstring');
const moment = require('moment');

const postSchema = require('../../validators/post.valid');
const { Article } = require('../../models');

postRoute.get('/', (req, res) => {
    const pag = parseInt(req.query.page) || 1;
    const size = 10;
    const query = {
        skip: size * (pag - 1),
        limit: size
    };
    
    Article.count({ createdBy: req.user.id })
        .then(totalCounts => {
            if (!totalCounts) return res.boom.notFound();
            
            const pagination = {
                current: pag,
                limit: totalCounts,
                prev: pag === 1 ? null : (pag - 1),
                next: (pag) === totalCounts ? null : (pag + 1)
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
});

postRoute.get('/create', (req, res) => {
    res.render('user/posts/newpost', {
        firstname: req.user.firstname,
        lastname: req.user.lastname
    });
});

postRoute.get('/edit', (req, res) => {
    res.render('user/posts/updatepost');
});

postRoute.post('/create', validator.body(postSchema),(req, res) => {
    const body = req.body;
    const article = new Article({
        _id: `${body.postTitle}-${randomString.generate({length: 12, charset: 'alphanumeric'})}`,
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
            res.redirect('/users/posts');
        })
        .catch(err => {
            console.error(err);
            res.boom.badImplementation();
        });
});

module.exports = postRoute;