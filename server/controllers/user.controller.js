const { Article } = require('../models');
const { ObjectId } = require('mongoose').Types;


const renderDashboardPage = async (req, res) => {
    Article.count({ createdBy: req.user.id })
        .then(count => ({ totalPosts: count }))
        .then(async toRender => {
            const art = await Article.findOne({createdBy: req.user.id}).sort({_id: -1});

            // if post does not exist
            if (!art) return {...toRender, post: { latestPost: false }};

            return {
                ...toRender,
                post: {
                    latestPost: true,
                    thumb: art.coverPic,
                    description: art.description,
                    title: art.title,
                    id: art._id
                }
            };
        })
        .then(toRender => res.render('user/dashboard', toRender))
        .catch(err => console.error(err));
};

const renderProfilePage = (req, res) => {

};

const renderSettingsPage = (req, res) => {
    res.render('user/settings');
};


module.exports = {
    renderDashboardPage,
    renderProfilePage,
    renderSettingsPage
};