const express = require('express');
const billingRouter = express();
const stripe = require('stripe')(process.env.stripeSecretKey);
const { requireLogin } = require('../middlewares/requireLogin.js');

billingRouter.post('/api/stripe', requireLogin, async (req, res) => {
  if (!req.user) {
    return res.status('401').send({ error: 'You must log in' });
  }

  const charge = await stripe.charges.create({
    amount: 500,
    currency: 'usd',
    description: '$5 for 5 cucks',
    source: req.body.id,
  });

  const updatedUser = await req.user.changeCredits(charge.amount / 100);
  return res.send(updatedUser);
});

module.exports = billingRouter;
