var async = require('async');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var builder = require('botbuilder');
module.exports = {
	
listFolders:function(mongooj,conf,pId,ptype,callback) {
	var titleList = new Object();
	//pId == parent_id == container_id
	console.log(pId);
	if (ptype == 1) {
		mongooj.collection(conf.db.containersCollection).find({'parent_container_id':pId}).toArray( function(err,docs){
			for (var i = 0; i < docs.length; i++) {
				//console.log(docs[i]);
				var metaData = new Object();
				metaData.id = docs[i]._id.toString();
				metaData.name = docs[i].name;
				titleList[docs[i].name] = metaData;
			}
			console.log(titleList);
			return callback(titleList);
 		});
	}
	else {
		mongooj.collection(conf.db.containersCollection).find({'project_id':pId,'is_root':0}).toArray( function(err,docs){
			for (var i = 0; i < docs.length; i++) {
				//console.log(docs[i]);
				var metaData = new Object();
				metaData.id = docs[i]._id.toString();
				metaData.name = docs[i].name;
				titleList[docs[i].name] = metaData;
			}
			//console.log(titleList);
			return callback(titleList);
 		});
	}
	}
};