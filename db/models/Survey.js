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

surveySchema.statics.updateRecipientResponse = async function(
  surveyId,
  email,
  choice
) {
  const updatedSurvey = await this.updateOne(
    {
      _id: surveyId,
      recipients: {
        $elemMatch: { email: email, responded: false },
      },
    },
    {
      $inc: { [choice]: 1 },
      $set: { 'recipients.$.responded': true },
      lastResponded: new Date(),
    }
  );

  return updatedSurvey;
};

const Survey = mongoose.model('Surveys', surveySchema);

module.exports = { Survey };
