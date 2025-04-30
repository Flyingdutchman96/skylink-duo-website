const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  try {
    const { quantity, upsell } = req.body;
    const lineItems = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'SkyLink Duo',
          },
          unit_amount: 5900, // €59
        },
        quantity,
      },
    ];

    if (upsell) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'SkyLink Duo (Upsell)',
          },
          unit_amount: 4900, // €49
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });
    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};