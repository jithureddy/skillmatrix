var builder = require('botbuilder');
module.exports = {
	sendPleasantries:function(session) {
		var pleasantries = conf.pleasantries;
		pleasantriesIndex = Math.floor(Math.random() * pleasantries.length);
		randomPleasantries = pleasantries[pleasantriesIndex];
		session.send(randomPleasantries);
	}
};