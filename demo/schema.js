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


