var builder = require('botbuilder');
module.exports = {
sendGreeting:function(conf,session) {
	var greetings = conf.greetings;
	greetingIndex = Math.floor(Math.random() * greetings.length);
	randomGreeting = greetings[greetingIndex];
	console.log(session.userData);
	session.send(randomGreeting);
	//session.send(randomGreeting + ' ' +session.userData.personalDetails.firstName +'!');
}
};