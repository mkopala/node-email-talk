var port = 8300;
var simplesmtp = require('simplesmtp');
var MailParser = require("mailparser").MailParser;

function handleReq(req) {
  // Interesting mail handling code ...	
	var	mailparser = new MailParser();
		mailparser.on('end', function(mail) {
			console.log(mail);
			req.accept();
		});
		req.pipe(mailparser);
}

server = simplesmtp.createSimpleServer({}, handleReq);
server.listen(port, function() {
  console.log("Email server running on port " + port);
});
