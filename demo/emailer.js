// Set up the SMTP mailer
var nodemailer = require('nodemailer');
var opts = {
	host: '127.0.0.1',
	port: 8300
};
var transport = nodemailer.createTransport("SMTP", opts);

module.exports = transport;

