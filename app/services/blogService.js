"use strict";

const ObjectID = require('mongodb').ObjectID;
const uuid = require('uuid').v4;
const config = require('../../config');
const profileService = require('./profileService');

const svc = module.exports = {};

const db = require('./db');


svc.findArticles = function(params) {
    var limit = params.limit || 20;
    var skip = params.skip || 0;

    const q = {};

    return Promise.props({
        total_records : db.blog_articles.count(q),
        skip : skip,
        limit : limit,
        rows : db.blog_articles.find(q)
            .limit(limit)
            .skip(skip)
    });
}

svc.saveArticle = function(article) {
    
    if(article.id) {
        return db.blog_articles.update({_id : article.id} , { $set: article })
    } else {
        return db.blog_articles.create(article); 
    }
    
}


svc.getArticle = function(id) {
    return db.blog_articles.findOne({_id: ObjectID(id)});
}

svc.findArticleBySlug = function(slug) {
    return Promise.props({
        articles_slug: db.blog_articles.findOne({slug: slug}),
        authorInfo: profileService.minimal(),
        articles_related: findRelated()
    });
}

svc.findRelated = function(params) {
    var tags = params.tags;
    var categories = params.categories;
    var keyword = params.keyword;
    var limit = params.limit || 20;


    return Promise.props({
        count : db.blog_articles.find({$or: [{tags: tags}, {categories: categories}, {keyword: keyword}]}).count(),
        limit : limit,
        rows : db.blog_articles.find({$or: [{tags: tags}, {categories: categories}, {keyword: keyword}]}).limit(limit)
    });


}

svc.findComments = function(params) {
    var id = params.id;
    var status = params.status;
    var blog_article_id = params.blog_article_id;

    return Promise.props({
        comments_by_id_and_status: db.comments.find({$and: [{blog_article_id: blog_article_id}, {status: status}]}),
        comments_pending: db.comments.find({status: 'P'}),
        basic_profile: profileService.minimal(id)
    });

}

svc.updateComment = function(data) {
    var id = data.id;

    var addData = {
        status: data.status,
        body: data.body
    };


    return db.comments.findOne({id: id}).then(comment => {
        Object.assign(comment, addData);
        db.comments.save(comment);
    }).then(comment => {
        if (!comment)
            throw new Error('invalid comment');

        return {
            success: true,
            message: "Successfully updated"
        };
    });

}

svc.addComment = function(data) {
    return db.comments.create(data);
}


