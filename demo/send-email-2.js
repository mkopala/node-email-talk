var schema = require('./schema');
var Email = schema.Email;
var mailer = require('./emailer');
var ObjectId = require('mongoose').Schema.ObjectId;

// Construct the email
var obj = {
	to: 'Bob <bob@example.com>',
	from: 'Alice <alice@example.com>',
	subject: "Test Message",
	text: "Hello!\n\nThis is my email message.",
};

// Send it
mailer.sendMail(obj, function(err, status) {
	// FIXME: Add some error handling ...

	// Create the DB object, set the Message-ID, and save it
	var email = new Email(obj);
	email.messageId = status.messageId;
	email.thread = new ObjectId;
	email.save(function(err) {
		console.log("Saved new email to DB");
		process.exit()
	});
});



