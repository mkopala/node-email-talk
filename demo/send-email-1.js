// Set up the SMTP mailer
var nodemailer = require('nodemailer');
var opts = {
	host: '127.0.0.1',
	port: 8300
};
var transport = nodemailer.createTransport("SMTP", opts);

// Construct the email
var email = {
	to: 'Bob <bob@example.com>',
	from: 'Alice <alice@example.com>',
	subject: "Test Message",
	text: "Hello!\n\nThis is my email message.",
};

// Send the Email
transport.sendMail(email, function(err, status) {
	console.log(err, status);
	process.exit();
});
