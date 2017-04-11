"use strict";
const mjml = require('mjml');
const svc = module.exports = {};
const db = require('./db');
const handlebars = require('handlebars');
const config = require('../../config');
const mailgun = require('mailgun-js')({apiKey: config.notification.mailgun_key, domain: config.notification.mailgun_domain});

svc.saveTemplate = function(data){ 
    return db.email_template.create(data);  
}

svc.sendTemplate = function(params) {
    if(!params.key){
        throw new Error('Key is required to send a template email');
    }
    
    // get the least sent template (for A/B testing)
    return db.email_template.findOne({key: params.key}).sort({sent:1}).then(template => {
        if(!template) {
            console.log(`** Warning!!! : Template with a key '${params.key}' not found`)
            return Promise.resolve();
            // throw new Error(`Template with a key '${params.key}' not found`);
        }
        
        const source = mjml.mjml2html(template.body); 
        const tmpl = handlebars.compile(source.html) ;
        const html = tmpl(params.data);

        var msg = {
            from: config.notification.from, 
            to: params.to,
            subject: template.subject,
            html: html
        };

        return mailgun.messages().send(msg).then(data => {
            console.log(data); 
            
            template.sent++;
            return template.save();
        });
    })
}

svc.signup = function(user) {
    return svc.sendTemplate({key:'signup', to: user.email, data:user});
}

svc.change_of_email = function(user) {
    return svc.sendTemplate({key:'change_of_email', to: user.email, data:{user:user}});
}

svc.confirm_email = function(user) {
    return svc.sendTemplate({key:'confirm_email', to: user.email, data:{user:user}});
}

svc.change_password = function(user) {
		return svc.sendTemplate({key:'change_password', to: user.email, data: {user:user}});
}

svc.reset_password = function(user) {
    return svc.sendTemplate({key:'reset_password', to: user.email, data: {user:user}});
}

svc.forgot_password = function(user, token) {
    return svc.sendTemplate({key: 'forgot_password', to: user.email, data: {user:user, token: token.accessToken}});
}

svc.new_message = function(user, conversation) {
    return svc.sendTemplate({key:'change_of_email', to: user.email, data:{
        user: user, 
        conversation: conversation
    }});
}

svc.new_castingcall = function(user, castingcall) {
    return svc.sendTemplate({key:'new_castingcall', to: user.email, data:{
        user: user,
        castingcall: castingcall
    }});
}

svc.new_booking_request = function(params) {
    console.log(params);
    return svc.sendTemplate({key:'new_booking_request', to: params.user.email, data:params});
}

svc.booking_request_received = function(params) {
    console.log(params);
    return svc.sendTemplate({key:'booking_request_received', to: params.user.email, data:params});
}


/**
 * Send notification to a blogger when a comment has been submitted
 * @param params
 * @return {Promise.<T>}
 */
svc.blog_article_comment_blogger = function(params) {
    console.log(`\n** Warning!!! : method blog_article_comment_blogger not yet implemented `)
    return Promise.resolve();
    // return svc.sendTemplate({key:'booking_counter', to: params.user.email, data:params});
}

/**
 * Send notification to a commenter when a comment has been submitted
 * @param params
 * @return {Promise.<T>}
 */
svc.blog_article_commenter = function(params) {
    console.log(`\n** Warning!!! : method blog_article_commenter not yet implemented `)
    return Promise.resolve();
    // return svc.sendTemplate({key:'commenter', to: params.user.email, data:params});
}

/**
 * Send notification to a follower when a comment has been submitted
 * @param params
 * @return {Promise.<T>}
 */
svc.blog_article_follower = function(params) {
    console.log(`\n** Warning!!! : method blog_article_follower not yet implemented `)
    return Promise.resolve();
    // return svc.sendTemplate({key:'follower', to: params.user.email, data:params});
}