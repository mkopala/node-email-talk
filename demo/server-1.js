var port = 8300;
var simplesmtp = require('simplesmtp');

//var opts = {
//  SMTPBanner: "Test Email Server"
//};
var opts = {};

function handleReq(req) {
  // Interesting mail handling code ...	
  console.log(req);
  
  req.accept()
}

server = simplesmtp.createSimpleServer(opts, handleReq);
server.listen(port, function() {
  console.log("Email server running on port " + port);
});
