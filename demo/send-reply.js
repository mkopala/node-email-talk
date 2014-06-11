var mailer = require('./emailer');

// Construct the email
var obj = {
	to: 'Bob <bob@example.com>',
	from: 'Alice <alice@example.com>',
	subject: "Test Message",
	text: "Hello!\n\nThis is my email message.",
	inReplyTo: process.argv[2]
};
console.log(process.argv[2]);

// Send the reply
mailer.sendMail(obj, function(err, status) {
	console.log("Sent reply");
	process.exit()
});




