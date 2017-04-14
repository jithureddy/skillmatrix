var async = require('async');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var builder = require('botbuilder');

module.exports = {
sendIntermediateMessages:function (conf,session) {
	var intermediateReps = conf.intermediatereps;
	intermediateRepsIndex = Math.floor(Math.random() * intermediateReps.length);
	randomintermediateReps = intermediateReps[intermediateRepsIndex];
	randomintermediateReps = module.exports.replaceAll(randomintermediateReps,'mcname',session.userData.personalDetails.firstName);
	session.send(randomintermediateReps);
},

replaceAll:function(str, find, replace) {
	return str.replace(new RegExp(module.exports.escapeRegExp(find), 'g'), replace);
},

escapeRegExp:function(str) {
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

};