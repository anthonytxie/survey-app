const mongoose = require('mongoose');
const { Schema } = mongoose;
const { recipientSchema } = require('./Recipient.js');

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  dateSent: Date,
  lastResponded: Date,
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  recipients: [recipientSchema],
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Survey = mongoose.model('Surveys', surveySchema);

module.exports = { Survey };
