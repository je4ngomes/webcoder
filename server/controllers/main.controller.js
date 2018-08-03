const { Article } = require('../models');
const { genPaginationObj } = require('../utils');
const marked = require('marked');

const renderHomePage = (req, res) => {

    Article.find({ status: 'public' }, {},{ limit: 6 }).sort({_id: -1 })
        .then(articles => {
            if (!articles) return { recentPosts: false};

            const posts = articles
                .map(article => ({
                    title: article.title,
                    coverPhoto: article.coverPic,
                    description: article.description,
                    id: article._id
                }));

            return { recentPosts: true, articles: posts };
        })
        .then(toRender => {

            if (req.isAuthenticated()) {
                return res.render('home/home', {
                    isLogged: req.isAuthenticated(),
                    admin: req.user.isAdmin,
                    ...toRender
                });
            }
            
            res.render('home/home', { ...toRender });
        });
}

const renderPostsPage = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = 12;
    const query = {
        skip: size * (page - 1),
        limit: size
    };
    
    Article.count({})
        .then(totalCounts => { 
                 
            const pagination = genPaginationObj(page, totalCounts, size);            

            Article.find({ status: 'public' }, {}, query).sort({_id: -1 })
                .then(articles => {
                    if (!articles) return { recentPosts: false};

                    const posts = articles
                        .map(article => ({
                            title: article.title,
                            coverPhoto: article.coverPic,
                            description: article.description,
                            id: article._id
                        }));

                    return { recentPosts: true, articles: posts };
                })
                .then(toRender => {

                    if (req.isAuthenticated()) {
                        return res.render('home/posts', {
                            isLogged: req.isAuthenticated(),
                            admin: req.user.isAdmin,
                            ...toRender,
                            pagination
                        });
                    }
                    
                    res.render('home/posts', { ...toRender });
                });
        });
};

const renderAboutPage = (req, res) => {
    res.render('home/about', { 
        isLogged: req.isAuthenticated(), 
        admin: req.user.isAdmin 
    });
};

const renderViewPage = (req, res) => {
    //reset layout
    res.locals.layout = '';

    const post = req.query.p;

    Article.findById(post)
        .then(article => {
            if (!article)
                return res.boom.notFound();

            res.render('home/view', {
                isLogged: req.isAuthenticated(),
                title: article.title,
                coverPhoto: article.coverPic,
                body: marked(article.body)
            });
        });
};

const logOut = (req, res) => {
    req.logOut();
    res.redirect('/')
};

module.exports = {
    renderHomePage,
    renderPostsPage,
    renderAboutPage,
    renderViewPage,
    logOut
};