const express = require('express');
const cors = require("cors");
bodyParser = require('body-parser').json();
require("dotenv").config(); 
// const stripe = require("./routes/stripe");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 
const data = require('./data');
const singleData = require('./single-data');

const app = express();

app.use(cors());




app.post("/api/create-checkout", bodyParser, async (req, res) => {
    console.log(JSON.stringify(req.body.cartItems))
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        cart: JSON.stringify(req.body.cartItems),
      },
    });
  
    const line_items = req.body.cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.desc,
            metadata: {
              id: item.id,
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.cartQuantity,
      };
    });
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "KE"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items,
      mode: "payment",
      customer: customer.id,
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
  
    // res.redirect(303, session.url);
    res.send({ url: session.url });
  });

app.get('/api/data', (req, res) => {
    res.json(data);
});

app.get('/api/single-data', (req, res) => {
    const { id } = req.query;
    if (id) {
        const item = singleData.find((d) => d.id === id);
        if (!item) {
            res.status(404).json({ error: "Item not found" });
        } else {
            res.json(item);
        }
    } else {
        res.status(400).json({ error: "Missing id in query parameters" });
    }
});

module.exports = app;
