var port = 8300;
var simplesmtp = require('simplesmtp');
var mailer = require('./emailer');
var MailParser = require("mailparser").MailParser;

function handleReq(req) {
	// Prevent recursion for this contrived example ...
	if (req.to[0] === 'charlie@example.com') {
		console.log("Got message for charlie");
		return;
	}

    // Interesting mail handling code ...	
	var	mailparser = new MailParser();
		mailparser.on('end', function(mail) {
			// Forward the message
			mail.envelope = {
				to: "charlie@example.com"
			};

			mailer.sendMail(mail);

			console.log("Forwarded message to charlie");

			req.accept();
		});
		req.pipe(mailparser);
}

server = simplesmtp.createSimpleServer({}, handleReq);
server.listen(port, function() {
  console.log("Email server running on port " + port);
});
