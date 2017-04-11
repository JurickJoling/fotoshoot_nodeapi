'use strict';

const chai = require('chai');
const should = chai.should();

const svc = require('../app/services/blogService');



describe("We are testing blogs" , function(){
    const rand = Math.round(Math.random() * Number.MAX_SAFE_INTEGER )
    it("create a new post", function(done) {

        svc.saveArticle({
            title : 'title ' + rand
        }).then(data => {
            data.body = 'Test body';
        svc.saveArticle(data).then(data => {
            console.log(data);
        done();
    })

    }).catch(err => done(err))
    })

    it("Should not get Article", done => {
        svc.getArticle("58d0771a891fe813e972b43f").then(data => {
        if (data)
        done(new Error("Should not get Article"));
    else
    done();
}, err => {

    })
})

    it("Should get Article", done => {
        svc.getArticle("58d0771a891fe813e972b43e").then(data => {
        if (data)
        done();
    else
    done(new Error("Should get Article"));
}, err => {

    })
})

    it("Should find article by Slug", done => {
        svc.findArticleBySlug("slug").then(data => {
        if (data.articles_slug)
    done();
    else
    done(new Error("Should find by Slug"))
})
})

    it("Should find article by Slug", done => {
        svc.findArticleBySlug("slug").then(data => {
        if (data.articles_slug)
    done(new Error("Should find by Slug"))
    else
    done();
})
})

    it("Should find article by tags, categories, keyword", done => {
        svc.findRelated({ tags: "t1", categories: "c2", keyword: '', limit: 1}).then(data => {
        if (data.length == 1) {
        done()
    }
    else if (data.length > 1) {
        done(new Error("Only should find one article"))
    }
    else done(new Error("Should find article by tags, categories, keyword"))
})
})

    it("Should not find article by tags, categories, keyword", done => {
        svc.findRelated({tags: 't10', categories: "", keyword: '', limit: 1}).then(data => {
        if (data.length > 0) {
        done(new Error("Should not find any aticles"));
    }
    else {
        done();
    }
})
})

    it("Should get comments", done => {
        svc.getComments({
        id: "58d0771a891fe813e972b43e",
        status: "P"
    }).then(data => {
        if (data) {
            done();
        }
        else {
            done(new Error("Should get comments"))
}
})
})

    it("Should not get comments by this status", done => {
        svc.getComments({
        id: "58d0771a891fe813e972b43e",
        status: "T"
    }).then(data => {
        if (data) {
            done(new Error("Should not get comments by this status"))
        }
        else {
            done()
        }
    })
})

    it("Should not get comments by this id", done => {
        svc.getComments({
        id: "58d0771a891fe813e972b43f",
        status: "P"
    }).then(data => {
        if (data) {
            done(new Error("Should not get comments by this id"))
        }
        else {
            done()
        }
    })
})

    it("Should not get comments", done => {
        svc.getComments({
        id: "58d0771a891fe813e972b43f",
        status: "T"
    }).then(data => {
        if (data) {
            done(new Error("Should not get comments"))
        }
        else {
            done()
        }
    })
})

})