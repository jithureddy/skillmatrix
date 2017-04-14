var async = require('async');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var builder = require('botbuilder');
var intersectionObj = require('array-intersection');
var sets = require('simplesets');
var randomcolor=require("randomcolor") ;

module.exports = {

    updateCommentMDay:function(ws,workitem, commentbody,user_id,comment_type) {
    	//comment = JSON.parse(comment);
    	var commentItem = new Object();
        commentItem.author = user_id;
        commentItem.container_id = workitem.container_id;
        commentItem.work_item_id = workitem._id.toString();
        commentItem.item_title = workitem.name;
        commentItem.hasChildren = 0;
        commentItem.timestamp = Date.now();
        commentItem.comment_level = '';
        commentItem.isDeleted = 0;
        commentItem.childComments = new Array();
        commentItem.commentType = comment_type;
        commentItem.type = "add_work_item_metaedit_comment";
        commentItem.state = "add_work_item_metaedit_comment_slack";
        //commentItem.item_title = comment.name;
        commentItem.comment = commentbody;
        console.log(commentItem);
        ws.send(JSON.stringify(commentItem));
    }
};