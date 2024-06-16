import express from 'express';
import Stripe from 'stripe';

const publicKey =
  'pk_test_51NW7xFFRAKA8j90mbAE00MKAqnZb4MLHNRSad6xy2qIZuAQLLzcuFQRYnGoIG5lAXvBKWeEPiVnafCd1OOcWaf0p00y3tLPpap';
const secretKey =
  'sk_test_51NW7xFFRAKA8j90mmjKb0rN9K1VTTtVuvrEkgUGjswRG7OA2AnkGI7p0n5OO1AgfbeBGXZciUJFs2bncRemZwW5z00onWHwRaV';
const app = express();

app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  console.log(req.body);
  const { email, currency, amount } = req.body;
  const stripe = new Stripe(secretKey, {
    apiVersion: '2020-08-27',
  });
  const customer = await stripe.customers.create({ email });
  const params = {
    amount: parseInt(amount),
    currency,
    customer: customer.id,
    payment_method_options: {
      card: {
        request_three_d_secure: 'automatic',
      },
    },
    payment_method_types: [],
  };
  try {
    const paymentIntent = await stripe.paymentIntents.create(params);
    return res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.send({ error: error.raw.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('server is running on port', PORT);
});
