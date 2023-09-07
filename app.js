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



var customerId = '';
app.post("/api/create-checkout", bodyParser, async (req, res) => {

    const get_customer = await stripe.customers.search({
      query: 'email:\''+req.body.email+'\' ',
    });

    if (get_customer.data && get_customer.data.length > 0) {
      var customerId = get_customer.data[0].id;
    }
    else{
      const customer = await stripe.customers.create({
        name:req.body.customer_name,
        phone:req.body.customer_phone,
        email:req.body.customer_email,
        shipping: {
          address: {
            city: req.body.shipping.address.city,
            country: req.body.shipping.address.country,
            line1: req.body.shipping.address.line1,
            line2: req.body.shipping.address.line2,
            postal_code: req.body.shipping.address.postal_code,
            state: req.body.shipping.address.state
          },
          name:req.body.shipping.shipping_name,
          phone:req.body.shipping.shipping_phone,
        },
          address: {
            city: req.body.billing.address.city,
            country: req.body.billing.address.country,
            line1: req.body.billing.address.line1,
            line2: req.body.billing.address.line2,
            postal_code: req.body.billing.address.postal_code,
            state: req.body.billing.address.state
          },
      });
      var customerId = customer.id;
    }
    

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
        allowed_countries: ["US"],
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
        enabled: false,
      },
      line_items,
      mode: "payment",
      customer: customerId,
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
    // res.redirect(303, session.url);
    
    res.send(session.url);
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
