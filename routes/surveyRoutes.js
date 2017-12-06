const { Mailer } = require('../services/Mailer.js');
const { Survey } = require('../db/models/Survey.js');
const { surveyTemplate } = require('../services/emailTemplates/surveyTemplate');

const express = require('express');
const surveyRouter = express();
const { requireLogin } = require('../middlewares/requireLogin.js');
const { requireCredits } = require('../middlewares/requireCredits.js');

surveyRouter.get('/api/surveys', (req, res) => {
  res.send('Thanks for voting');
});

surveyRouter.post(
  '/api/surveys',
  requireLogin,
  requireCredits,
  async (req, res) => {
    const { title, body, subject, recipients } = req.body;
    const _user = req.user._id;

    const survey = new Survey({
      title,
      body,
      subject,
      _user,
      dateSent: Date.now(),
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
    });
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      await survey.save();
      const returnedUser = await req.user.changeCredits(-1);
      res.send(returnedUser);
    } catch (err) {
      res.status(422).send(err);
    }
  }
);

module.exports = surveyRouter;
