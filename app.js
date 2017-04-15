var restify = require('restify');
var builder = require('botbuilder');
var mongodb = require("mongodb");
var request = require('request');
var conf = require('./config');
var MONGOURL = conf.db.connection;
var ObjectID = mongodb.ObjectID;
var ws_url = '';
var wListG = new Array();
var userAddresses = new Array();
var slack_token = 'xoxp-137435450964-137288504211-168783399344-b0d55dfeba2b3198157e7e47a4f03b23';
var slack_userlist = 'https://slack.com/api/users.list?token=';
var cron = require('node-cron');
//Async for promises
var async = require('async');
var randomcolor=require("randomcolor") ;
var Slack = require('slack-node');
slack = new Slack(slack_token);
var moment = require('moment');
var intersectionObj = require('array-intersection');
var sets = require('simplesets');
//code module import start

var websocketobj = require('./code_modules/websocket.js');
var sendgreeting = require('./code_modules/sendgreeting.js');
var listfolders = require('./code_modules/listfolders.js');
//code module import end

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(MONGOURL, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
});

//=========================================================
// Bot Setup
//=========================================================
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});
// request.post(
// 	    conf.http.url+'slack/auth/getws',
// 	    { json: {}},
// 	    function (error, response, body) {
// 	        if (!error && response.statusCode == 200) {
// 	            ws_url = body.content.url;
// 	            console.log(ws_url);
//         }
//     }
// );

console.log(conf.bot);
// Create chat bot
var connector = new builder.ChatConnector({
    appId: conf.bot.appId,
    appPassword: conf.bot.appPass
});

//---------------------------------
// Socket and DB Setups
//---------------------------------

// var WebSocket = require("ws");
// const ws = new WebSocket(conf.ws.url+ws_url, {
//   //origin: 'https://websocket.org'
// });


var bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

//var model='https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/8273fa69-37be-4905-bdea-8b0d8797bebf?subscription-key=451cdba1d539430d8b754fe3c922389f&verbose=true';

var model='https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/635298a4-12f9-4194-a6b8-a267a5934f38?subscription-key=d8e5e32ab6ba485797e97f9c3cefd623&timezoneOffset=0.0&verbose=true';

var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
var intents = new builder.IntentDialog();
// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 3.0, resetCommand: /^reset/i }));

bot.dialog('/',dialog);

bot.dialog('/listFolders', [
	function (session, args, next) {
 		//var folderList = listFolders(1);
 		listfolders.listFolders(db,conf,1,0, function(folderList) {
 			session.userData.folderData = folderList;
			builder.Prompts.choice(session, "List of folders, Please choose one to start using it.", folderList);
		});
    },
    function (session, results,folderList) {
        if (results.response) {
        	console.log(results.response);
        	console.log(session.userData.folderData);
            var selectedFolder = session.userData.folderData[results.response.entity];
            var context = new Object();
            context.folderId = selectedFolder.id;
            session.userData.context = context;
            session.send("You have selected %(name)s with id %(id)s", selectedFolder);
            session.endDialogWithResult();
        } else {
            session.send("ok");
        }
    }
]);

bot.dialog('/greetingDialog',[
	function(session, args) {
		sendgreeting.sendGreeting(conf,session);
	}
]);


dialog.matches('welcomeDialog', [
	function (session, args, next) {
		//console.log("session.message.address==>",session.message.address);
		if (!checkNestedObj(session.userData, 'personalDetails')) {
			console.log("in personal");
			session.beginDialog('/setUserData');
		}
		else {
			sendgreeting.sendGreeting(conf,session);
		}
		//console.log(session.userData);
    }
    ]);

dialog.matches('pleasantries', [
	function (session, args, next) {
 		sendpleasantries.sendPleasantries(conf,session);
	}
    ]);

dialog.matches(/^:*:/i, [
    function (session,args,next) {
		session.send("I dont understand emoji's.");
    }
    ]);



dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand."));

function createProjectDb(projectData) {
	ws.send(JSON.stringify({type:"cc_add_project",projectData:projectData,state:'cc_add_project'}));
}
function createWorkItem(workitemData) {
	ws.send(JSON.stringify({type:"cc_add_workitem",workitemData:workitemData,state:'cc_add_workitem'}));	
}
function createFolderDb(folderData) {

}
