var async = require('async');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var builder = require('botbuilder');
var intersectionObj = require('array-intersection');
var sets = require('simplesets');
var randomcolor=require("randomcolor") ;
var moment = require('moment');
module.exports = {
	//it's return n randome color
	color:function color(n){
		return randomcolor.randomColor({
		count: n,
		hue: 'random'})
	},


	//with color , with or without number
	//set numbering is undefine if number not require
	//this will display colorfull list
	displayList:function(msglist,title,fallback,numbering){
		var attachments =[];
		if(typeof fallback  !== 'undefined'){
			var notification_heading={"fallback":fallback}
			    attachments.push(notification_heading); 
		}
	  	if(typeof title  !== 'undefined'){
			var t={"pretext": title}
		  		attachments.push(t);
		}
		colorlist=module.exports.color(msglist.length)   //get n randome color
		if(typeof numbering  !== 'undefined'){
			for (var i = 0; i < msglist.length; i++) {
				var j=i+1
				var onemsg=  {
			    	"color": colorlist[i],
			    	"text": j.toString()+"."+msglist[i]
				}
				attachments.push(onemsg); 
			}
		}

		else{
			for (var i = 0; i < msglist.length; i++) {
				var onemsg=  {
				    "color": colorlist[i],
				    "text": msglist[i]
				}
				attachments.push(onemsg); 
			} 
		}
		var slack={"attachments":attachments}
		return slack;
	},

	//without  color , with or without number
	//set numbering is undefine if number not require
	generalList:function(msglist,numbering){
		var value="";
		if(typeof numbering  !== 'undefined'){
			for (var j = 0; j < msglist.length; j++) {
				var number=j+1
				if(j==0){
					value=number.toString()+"."+msglist[j]
				}
				else{
					value=value+"\n\n"+number.toString()+"."+msglist[j]
				}
			}
		}
		else{
			for (var j = 0; j < msglist.length; j++) {
			  if(j==0){
			    value=msglist[j]
			   }
			  else{
			    value=value+"\n\n"+msglist[j]
			  }
			}
		}
		var onemsg=  {
		  "text":value
		}
		return onemsg;
	},

	generalMsg:function(msglist){
	    var value="";
	    var onemsg=  {
	      "text":msglist
	    }
	    return onemsg;
	},

	//this is example of project1 ->Rel1.1 Rel1.2, Rel1.3
					     //project2 ->Rel2.1 Rel2.2, Rel2.3
	//sublist  length can be any t		     
	generalList_intent:function(msglist,fallback,title,numbering){
	  var value="";
	  var attachments =[];

	  if(typeof fallback  !== 'undefined'){
	    var notification_heading={"fallback":fallback}
	        attachments.push(notification_heading); 
	      }
	  
	  if(typeof title  !== 'undefined'){
	    var t={"pretext": title}
	      attachments.push(t);
	  }

	 if(typeof numbering  !== 'undefined'){
	    for (var i = 0; i < msglist.length; i++) {
	      var j=i+1
	    var onemsg=  {
	        "color": "",
	        "text": j.toString()+"."+msglist[i]
	    }
	    attachments.push(onemsg); 
	    }
	  }

	  else{
	    allkeys=Object.keys(msglist)
	    
	    for (var i = 0; i < allkeys.length; i++) {
	        var value=""
	        value=allkeys[i]
	        for (var j = 0; j < msglist[allkeys[i]].length; j++) {
	          value=value+"\n    "+msglist[allkeys[i]][j]
	      }
	      console.log("value==",value)
	      var onemsg=  {
	          "color": "#cae572",
	          "text": value
	    }
	    attachments.push(onemsg);  
	  }
	   var slack={"attachments":attachments}
	   return slack;
	 }
	},

	workItemdisplay:function(workitemUpdate, title, fallback) {
		var value="";
		var attachments =[];
		var updateObject = {};
		if(typeof fallback  !== 'undefined'){
	    	var notification_heading={"fallback":fallback}
	        	attachments.push(notification_heading); 
		}
		if(typeof title  !== 'undefined'){
	    	updateObject.title=title
	      	updateObject.mrkdwn_in = ["title"];
	  	}
	  	if (typeof workitemUpdate.work_item_state !== 'undefined') {
	  		if (workitemUpdate.work_item_state.length >0) {
	  			if (arrContains.call(workitemUpdate.work_item_state,3)) {
	  				updateObject.color = "#FF5733";
	  			}
	  			else if (arrContains.call(workitemUpdate.work_item_state,2)) {
	  				updateObject.color = "#339CFF";
	  			}
	  			else if (arrContains.call(workitemUpdate.work_item_state,4)) {
	  				updateObject.color = "#A8FF33";
	  			}
	  			else {
	  				updateObject.color = "#FF33DA";
	  			}
	  		}
	  	}
	  	if (typeof workitemUpdate.comment !== 'undefined') {
	  		updateObject.text = workitemUpdate.comment;
	  	}
	  	if (typeof workitemUpdate.author !== 'undefined') {
	  		//updateObject.author_name = workitemUpdate.author;
	  		updateObject.footer = workitemUpdate.author;
	  	}
	  	if (typeof workitemUpdate.ts !== 'undefined') {
	  		updateObject.ts = parseInt((new Date(workitemUpdate.ts).getTime() / 1000).toFixed(0));
	  	}
	  	if (typeof workitemUpdate.footer_icon !== 'undefined') {
	  		updateObject.footer_icon = workitemUpdate.footer_icon;
	  	}
	  	attachments.push(updateObject);
	  	var slack={"attachments":attachments}
	  	console.log(slack);
	  	return slack;
	},
	//display in table format, handle upto two column
	displayTable_upto2:function(headerlist,columndata,color,title,fallback){
		var attachments ={};

		if(typeof fallback  !== 'undefined'){
			var notification_heading={"fallback":fallback}
		   	attachments.fallback=fallback
		}

		if(typeof title  !== 'undefined'){
			var titlefield={"pretext": title};
			var mrkdown = [
	                "pretext"
	        ];
			attachments.pretext="*"+title+"*"
			attachments.mrkdwn_in = mrkdown;

		}

		if(typeof color  !== 'undefined'){
			var colorfield={"color": color}
			attachments.color=color
		}

		else{
			var colorfield={"color": "#764FA5"}
		}

		var fields1 =[];

		for (var i = 0; i < headerlist.length; i++) {
			var j=(i+1).toString();
			var columnindex="columndata"+j
			var columnArray=[]

			if(j==1){
			   var temp=columndata.columndata1
			   columnArray=temp
			}
			else if(j==2){
			  var temp=columndata.columndata2
			  columnArray=columndata.columndata2
			}

			var value="";
			for (var j = 0; j < columnArray.length; j++) {
			  if(j===0){
			    value=columnArray[j]
			  }
			  else{
			    value=value+"\n"+columnArray[j]
			  }
			}

			var onemsg=  {
			    "title": headerlist[i],
			    "value": value,
			    "short": true
			}
			fields1.push(onemsg); 
		}

		attachments.fields=fields1  
		var list=[attachments]
		var temp = {attachments: list}
		return temp;
	},


//display in table format, handle upto two column
displayTable:function(session,data,timeobject,color,title,fallback){
    var attachments ={};

    if(typeof fallback  !== 'undefined'){
        var notification_heading={"fallback":fallback}
        attachments.fallback=fallback
    }

    var fields1 =[];

    var mongo_source_id=title.split("#id#")[1]
    title=title.split("#id#")[0]
    db.collection('work_items').findOne({'_id':ObjectID(mongo_source_id)}, function(err, workdoc) {
    if(!err){
        if(workdoc){

    console.log("workdoc==>",workdoc["work_item_state"],mongo_source_id)
    var work_iteam_state=workdoc["work_item_state"];

    if (work_iteam_state.length >0) {
            if (work_iteam_state.indexOf(3)>=0) {
                attachments.color = "#ff7d74";
            }
            else if (work_iteam_state.indexOf(2)>=0) {
                attachments.color = "#5ae0b9";
            }
            else if (work_iteam_state.indexOf(4)>=0) {
                attachments.color = "#61b8f5";
            }
            else if (work_iteam_state.indexOf(1)>=0) {
                attachments.color = "#e1e1e1";
            }
            else if (work_iteam_state.indexOf(5)>=0) {
                attachments.color = "#F3EA2B";
            }
            else {
                attachments.color = "#FF33DA";
            }
        }

    var hours="N/A"
    if("hours_remaining" in workdoc&&workdoc["hours_remaining"].length>0){
        var remainhours=workdoc["hours_remaining"][workdoc["hours_remaining"].length-1].hours;
        console.log("remainhours==",remainhours)
        if(remainhours!= '' && remainhours!= "undefined"&& remainhours!= null){
            hours=remainhours+" hours"
        }
    }
	title=workdoc["ref_id"]+"-"+title+ "-"+"Has about "+hours+" remaining"
    if(typeof title  !== 'undefined'){
        var mrkdown = [
                "pretext"
        ];
        attachments.pretext="*"+title+"*"
        attachments.mrkdwn_in = mrkdown;

    }
	var outer_track=0;
    var final_msg
    for(var key in data)
    {
        outer_track=outer_track+1   
        var templist=data[key];
        var value=""
        for (var i = 0; i < templist.length; i++) {
            if(templist.length==1){
              value=templist[i]+" feel "+key+"."//+"\n";  
            }

            else if(i==templist.length-1){
                value=value+" and "+templist[i]+" feel "+key+".";//+"\n";
            }

            else{
                if(i==0){
                     value=templist[i]
                }
                else{
                 value=value+","+templist[i]
                }    
            }
        }

        if(outer_track==1){
            final_msg=value
        }
        else{
                final_msg=final_msg+" "+final_msg
        }
    }

    var yourDate = new Date(timeobject);
    var timeago=moment(yourDate).fromNow()


    value=value+"\n This Update is "+timeago
    var onemsg=  {
            "title":"",
            "value":value,
            "short": true
        }
    fields1.push(onemsg); 

    attachments.fields=fields1  
    var list=[attachments]
    var tableout = {attachments: list}

    var countCard =  {
                    slack:tableout
                    }
    var msg2= new builder.Message(session).sourceEvent(countCard);//change here card name
    session.send(msg2);
    }

    }
    });

} 
};