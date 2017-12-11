const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const { Mailer } = require('../services/Mailer.js');
const { surveyTemplate } = require('../services/emailTemplates/surveyTemplate');
const express = require('express');
const surveyRouter = express();
const { requireLogin } = require('../middlewares/requireLogin.js');
const { requireCredits } = require('../middlewares/requireCredits.js');
const { Survey } = require('../db/models/Survey.js');

surveyRouter.get('/api/surveys/:surveyId/:choice', (req, res) => {
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

surveyRouter.post('/api/surveys/webhook', (req, res) => {
  const p = new Path('/api/surveys/:surveyId/:choice');

  const events = _.chain(req.body)
    .map(({ email, url }) => {
      const match = p.test(new URL(url).pathname);
      if (match) {
        return { email, surveyId: match.surveyId, choice: match.choice };
      }
    })
    .compact()
    .uniqBy('email', 'surveyId')
    .each(({ surveyId, email, choice }) => {
      Survey.updateRecipientResponse(surveyId, email, choice).then(() =>
        console.log('done')
      );
    })
    .value();

  console.log('done');
  // call value at the very end of chain
  res.send({});
});

module.exports = surveyRouter;
