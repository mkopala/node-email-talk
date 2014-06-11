var port = 8300;
var simplesmtp = require('simplesmtp');
var MailParser = require("mailparser").MailParser;
var schema = require('./schema');
var Email = schema.Email;

function handleReq(req) {
  // Interesting mail handling code ...	
	var	mailparser = new MailParser();
		mailparser.on('end', function(mail) {
			// Look up the original message
			Email.findOne({messageId: mail.inReplyTo}, function(err, orig) {
				if (err || orig == undefined) {
					console.error("Could not find original email");	
					return req.reject()
				}
				// Save the reply, with the thread set	
				reply = new Email(mail);
				reply.thread = orig.thread;

				reply.save(function(err) {
					console.log("Saved reply to DB");
					req.accept();
				})
			});
		});
		req.pipe(mailparser);
}

server = simplesmtp.createSimpleServer({}, handleReq);
server.listen(port, function() {
  console.log("Email server running on port " + port);
});
