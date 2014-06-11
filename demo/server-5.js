var port = 8300;
var simplesmtp = require('simplesmtp');

function handleReq(req) {
	// Assuming one recipient, for simplicity's sake
	recipient = req.to[0];

	// Check the domain of the recipient
	if (!recipient.match(/@mydomain\.com$/)) {
		console.log("Invalid recipient: " + recipient);
		req.reject("Invalid recipient domain");
	}
}

server = simplesmtp.createSimpleServer({}, handleReq);
server.listen(port, function() {
	console.log("Email server running on port " + port);
});
