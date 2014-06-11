# Node.js + Email


## About Me

Matt Kopala

picture in Namibia

whereinthehellismatt.com

picture, Red X, "He's cooler than me"


PHP, now node.js

backpacked for 3.5 years: 2003 - 2006

* Freelance developer & consultant
* Founder of TaskBump : [https://taskbump.com]

Other

GitHub

* [@mkopala](http://twitter.com/#!/mkopala)
* [http://mattkopala.com](http://mattkopala.com)

Not an expert, not thorough coverage


# Overview 


## Slides

Created with [Markdown] and [Bedecked]

All **code examples** extracted from working scripts/files

* available on GitHub: https://github.com/mkopala/node-email-talk

Error handling is **minimal** or **non-existant**

* to keep things short
* because I was too lazy to add it


## Goals

* Cover basic concepts of email for threading & replies
* Show how to handle email with node
* Provide access to actual working example code


## Survey

How many of you have:

- sent email with node.js?
- processed email with node.js?
    - IMAP
    - save file
    - raw SMTP
- used transaction email (SES, Gmail, Mailgun, Mandrill)




## Email headers

`Message-ID`

* Unique identifier for message.  
* Generated by mailer or SMTP service.

`In-Reply-To`

* Only present in email replies
* Used to link email messages together 

`References`

* Message IDs for previous email in this thread

See: http://en.wikipedia.org/wiki/Email#Header_fields


# Sending Email


## NodeMailer

<img src="images/nodemailer.png" />
<p style="height: 40px"></p>

NodeMailer - http://www.nodemailer.com/

    npm install nodemailer


<!--
The same author (Andris Reinman) has written these other **node.js** email-related modules:

* simplesmtp
* mail-parser
* mimelib
* dkim-signer, inbox, directmail, ...

(We'll cover)
-->


## Send a message

```
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
```


# Outgoing Email


## Email DB Schema

Basic **Mongoose DB** schema in `schema.js`:

```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed;
var ObjectId = Schema.Types.ObjectId;

var dbname = 'emaildb';

var EmailSchema = new Schema({
	to: Mixed,
	from: Mixed,
	subject: String, 
	messageId: String,
	inReplyTo: String,
	thread: ObjectId,
	created: { type: Date, default: Date.now }
});

mongoose.connect('mongodb://localhost/' + dbname);

exports.Email = mongoose.model('Email', EmailSchema);
```
See: http://mongoosejs.com/docs/guide.html


## DB Indexes

Let's add a few indexes, for `msgid` and `thread`:

<pre>
var EmailSchema = new Schema({
	to: Mixed,
	from: Mixed,
	subject: String,
	<div style="border: 5px solid red; padding: 0px; margin: 0px;">
	msgid: {
		type: String,
		index: true
	},
	thread: {
		type: ObjectId,
		index: true,
	},
    </div>
	created: { type: Date, default: Date.now }
};
</pre>


## Mailer Module

Wrap up our **NodeMailer** code into `emailer.js`:

```
var nodemailer = require('nodemailer');
var opts = {
	host: '127.0.0.1',
	port: 8300
};
var transport = nodemailer.createTransport("SMTP", opts);

module.exports = transport;
```


## Send & Save to DB

Send the message & save the `Message-ID`:

```
var mongoose = require('mongoose');
var schema = require('./schema');
var Email = schema.Email;
var mailer = require('./emailer');

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
	email.msgid = status.messageId;
	email.thread = new ObjectId;
	email.save(function(err) {
		console.log("Saved new email to DB");
		process.exit()
	});
});
```


## Check MongoDB collection

Check for our email object in MongoDB:

```
$ mongo emaildb
MongoDB shell version: 2.4.10
connecting to: emaildb
> db.emails.find().forEach(printjson) 
{
	"msgid" : "1402446996892.af4a271f@Nodemailer",
	"to" : "Bob <bob@example.com>",
	"from" : "Alice <alice@example.com>",
	"subject" : "Test Message",
	"_id" : ObjectId("5397a4943204af365d000001"),
	"created" : ISODate("2014-06-11T00:36:36.928Z"),
	"__v" : 0
}
```


# Receiving Email


## Gmail + IMAP/POP3

Not specific to Gmail - could be any mail service w/ IMAP or POP3 support

* 



## Postfix + Dovecot

I'm going to skip this one ...  But a couple of thoughts on it:

* more complicated - two extra serves, both requiring configuration




## SMTP with node.js

We can use **simplesmtp** to set up a simple SMTP server with node:
```
var port = 8300;
var simplesmtp = require('simplesmtp');

function handleReq(req) {
  // Interesting mail handling code ...	
  console.log(req);
  
  req.accept()
}

server = simplesmtp.createSimpleServer({}, handleReq);
server.listen(port, function() {
  console.log("Email server running on port " + port);
});
```


## Email body handling

Let's actually parse the email this time ...
<pre>
var port = 8300;
var simplesmtp = require('simplesmtp');
var MailParser = require("mailparser").MailParser;

var opts = {
  SMTPBanner: "Test Email Server"
};

function handleReq(req) {
  // Interesting mail handling code ...	
	var	mailparser = new MailParser();
		mailparser.on('end', function(mail) {
			console.log(mail);
			req.accept();
		});
		req.pipe(mailparser);
}

server = simplesmtp.createSimpleServer(opts, handleReq);
server.listen(port, function() {
  console.log("Email server running on port " + port);
});
</pre>


## Module Summary

### simplesmtp &rarr; SMTP server, protocol

### mailparser &rarr; handles the actual message, MIME, encoding


## SMTP Session

```
$ telnet localhost 8300
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
220 platypus ESMTP node.js simplesmtp
HELO example.org
250 platypus at your service, [127.0.0.1]
MAIL FROM: <alice@example.com>
250 2.1.0 Ok
RCPT TO: <bob@example.com>
250 2.1.0 Ok
DATA
354 End data with <CR><LF>.<CR><LF>
From: alice.example.com
To: bob@example.com
Subject: Test Message

This is a test
.
250 2.0.0 Ok: queued as 3bf1c3a2ea225fb36f49
quit
221 2.0.0 Goodbye!
Connection closed by foreign host.
```
See: http://en.wikipedia.org/wiki/SMTP#SMTP_transport_example


## Examples

Send a simple message, show the JSON for the SMTP exchange

* `send-email-1.js` + `server-1.js`

Send a simple message, show the JSON for the message body

* `send-email-1.js` + `server-2.js`


## Processing replies

- InReplyTo
- Subject - "Re:"
- specified - "To:" address


# Attachments


## Outgoing emails


## Incoming emails


## Email forwarding

Change the actual recipient in the **SMTP Envelope**.

<pre>
email = {
    from: "alice@example.com",
    to: "replies@example.com",
    <div style="border: 5px solid red">
    envelope: {
        to: "bob@example.com"
    }
    </div>
}
</pre>

See:

* [Email forwarding - Wikipedia](http://en.wikipedia.org/wiki/Email_forwarding)
* [Bounce address - Wikipedia](http://en.wikipedia.org/wiki/Bounce_address)


# DevOps


## Running on SMTP ports

Make it easy on ourselves, and increase availability

* keep `node` running & listening on a non-privileged port
* let `haproxy` direct your SMTP traffic to your node process(es)

Example **HAProxy** config:

```
listen smtp 127.0.0.1:25
	mode tcp
	balance roundrobin
	server smtp1 127.0.0.1:8300 check
	server smtp2 127.0.0.1:8301 check
```
See: [TODO: Add link]


## Spam

- Gmail, forwarding
- Spam Assassin
- other...?


# Other


## Mailin


## Haraka

<img src="/images/haraka.png">