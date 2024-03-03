const express = require("express")
const router = express.Router()
const connectDatabase = require('../config/connectDatabase')
const { addMonths } = require('date-fns');

const stripe = require('stripe')('sk_test_51M9AWiKa3gcPGhKTJaOAKnhWZgT7pA0dqch2kQ7uz7M5lXpt6dDckLjHdFIyYs1rgafA64sKm7eGH05O6aWWlo52006GcXLLcN');
const YOUR_DOMAIN = 'https://inventory.entwicklernetz.com';

const sendEmail = require("../utilities/send_email");
const verifyJWT = require("../middlewares/verifyJWT");
const { ObjectId } = require("mongodb");

const run = async () => {
    const db = await connectDatabase()
    const temp_stores_collection = db.collection("temp_store")
    const all_stores_collection = db.collection("all_stores")
    const store_owner_users_collection = db.collection("store_owner_users")

    const handleAfterSuccessfulPayment = async (subscription) => {
        const document = await temp_stores_collection.findOne({ session_id: subscription.id });
        // // This is the url to which the customer will be redirected when they are done
        // // managing their billing with the portal.

        if (document) {
            const storeOwners = document.store_owners;
            delete document.store_owners;
            document.subscription_status = "Active";
            document.total_order = 0;
            document.pending_form_submitted = 0;
            document.preparing_form_submitted = 0;

            const currentDate = new Date();
            const renewDate = addMonths(currentDate, 1);
            const isoRenewDate = renewDate.toISOString();
            document.renew_date = isoRenewDate;

            if (subscription.amount_total == 149900 || subscription.amount_total == 9900) {
                document.max_form_submission_limit = 300;
            }
            if (subscription.amount_total == 299900 || subscription.amount_total == 19900) {
                document.max_form_submission_limit = 1000;
            }

            // Insert the document into the destination collection
            const result = await all_stores_collection.insertOne({ ...document, customer: subscription.customer });
            // if there is exist store owners for the store then update store owners info
            if (storeOwners) {
                storeOwners?.map(async (storeOwnerId) => {
                    await store_owner_users_collection.updateOne({ _id: new ObjectId(storeOwnerId) }, {
                        $push: { "store_access_ids": result.insertedId.toString() }
                    })
                })
            }

            await temp_stores_collection.deleteOne({ session_id: subscription.id });
            console.log('Document moved successfully!');
        } else {
            console.log('Document not found in the source collection.');
        }
    }

    const handleRemoveUnsuccessfulPayment = async (subscription) => {
        const document = await temp_stores_collection.findOne({ session_id: subscription.id });
        if (document) {
            await temp_stores_collection.deleteOne({ session_id: subscription.id });
            console.log('Document delete successfully!');
        } else {
            console.log('Document not found in the source collection.');
        }
    }

    const changeSub = async (subscription) => {
        const document = await all_stores_collection.findOne({ customer: subscription.customer });
        if (document) {
            const currentDate = new Date();
            const renew_date = addMonths(currentDate, 1);
            const isoRenewDate = renew_date.toISOString()

            if (subscription.plan.amount == 149900 && !subscription.cancellation_details.reason)
                await all_stores_collection.updateOne({ customer: subscription.customer }, {
                    $set: {
                        subscription_plan: "Basic",
                        subscription_type: "yearly",
                        subscription_status: "Active",
                        max_form_submission_limit: 300,
                        renew_date: isoRenewDate,
                    }
                })
            if (subscription.plan.amount == 299900 && !subscription.cancellation_details.reason)
                await all_stores_collection.updateOne({ customer: subscription.customer }, {
                    $set: {
                        subscription_plan: "Pro",
                        subscription_type: "yearly",
                        subscription_status: "Active",
                        max_form_submission_limit: 1000,
                        renew_date: isoRenewDate,
                    }
                })
            if (subscription.plan.amount == 9900 && !subscription.cancellation_details.reason)
                await all_stores_collection.updateOne({ customer: subscription.customer }, {
                    $set: {
                        subscription_plan: "Basic",
                        subscription_type: "monthly",
                        subscription_status: "Active",
                        max_form_submission_limit: 300,
                        renew_date: isoRenewDate,
                    }
                })
            if (subscription.plan.amount == 19900 && !subscription.cancellation_details.reason)
                await all_stores_collection.updateOne({ customer: subscription.customer }, {
                    $set: {
                        subscription_plan: "Pro",
                        subscription_type: "monthly",
                        subscription_status: "Active",
                        max_form_submission_limit: 1000,
                        renew_date: isoRenewDate,
                    }
                })
            if (subscription.cancellation_details.reason) {
                await all_stores_collection.updateOne({ customer: subscription.customer }, {
                    $set: {
                        subscription_status: "Inactive"
                    }
                })
            }
        }
    }

    router.post('/create-checkout-session', express.json(), verifyJWT, async (req, res) => {
        try {
            const prices = await stripe.prices.list({
                lookup_keys: [req.body.lookup_key],
                expand: ['data.product'],
            });
            const session = await stripe.checkout.sessions.create({
                billing_address_collection: 'auto',
                line_items: [
                    {
                        price: prices.data[0].id,
                        // For metered billing, do not pass quantity
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: req.body.all_data.payment_option == 'yourself' ? `${YOUR_DOMAIN}/dashboard/payment-status?success=true&session_id={CHECKOUT_SESSION_ID}` : `${YOUR_DOMAIN}/payment-status?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: req.body.all_data.payment_option == 'yourself' ? `${YOUR_DOMAIN}/dashboard/payment-status?canceled=true` : `${YOUR_DOMAIN}/payment-status?canceled=true`,
            });
            const data = { ...req.body.all_data, session_id: session.id, store_owners: req.body.store_owners }
            const result = await temp_stores_collection.insertOne(data)
            if (result.acknowledged) {
                res.status(201).json(session);
            }
            else {
                res.status(500).json({ message: "Internal server error while inserting store data" })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    });

    router.post('/create-portal-session', express.json(), verifyJWT, async (req, res) => {
        try {
            // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
            // Typically this is stored alongside the authenticated user in your database.
            const { session_id } = req.body;
            const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

            // This is the url to which the customer will be redirected when they are done
            // managing their billing with the portal.
            const returnUrl = YOUR_DOMAIN;

            const portalSession = await stripe.billingPortal.sessions.create({
                customer: checkoutSession.customer,
                return_url: returnUrl,
            });

            res.send(portalSession.url);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    });

    router.post('/send-payment-link', express.json(), verifyJWT, async (req, res) => {
        try {
            const send_email_data = {
                email: req.body.email,
                subject: `Make Payment for Your Store - ${req.body.store_name}`,
                html: `
                <h1>Hi,${req.body.name} Go to link and make payment </h1> <br/>
                <button> <a style='color:red,text-decoration:none,' href="${req.body.paymentLink}">Click here</a></button>`
            }

            sendEmail(send_email_data);
            res.status(200).json({ message: 'Email sent' });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    })

    router.post('/webhook',
        express.raw({ type: 'application/json' }),
        (request, response) => {
            let event = request.body;
            // Replace this endpoint secret with your endpoint's unique secret
            // If you are testing with the CLI, find the secret by running 'stripe listen'
            // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
            // at https://dashboard.stripe.com/webhooks
            const endpointSecret = 'whsec_Yc7akirdGNYc9TfWv96HpkE8zDOk0bFk';
            // Only verify the event if you have an endpoint secret defined.
            // Otherwise use the basic event deserialized with JSON.parse
            if (endpointSecret) {
                // Get the signature sent by Stripe
                const signature = request.headers['stripe-signature'];
                try {
                    event = stripe.webhooks.constructEvent(
                        request.body,
                        signature,
                        endpointSecret
                    );
                } catch (err) {
                    console.log(`⚠️  Webhook signature verification failed.`, err.message);
                    return response.sendStatus(400);
                }
            }
            let subscription;
            let status;
            // Handle the event
            switch (event.type) {
                case 'checkout.session.completed':
                    subscription = event.data.object;
                    status = subscription.status;
                    if (status == 'complete') {
                        handleAfterSuccessfulPayment(subscription)
                    }
                    if (status == 'canceled') {
                        handleRemoveUnsuccessfulPayment(subscription)
                    }
                    // Then define and call a method to handle the subscription trial ending.
                    // handleSubscriptionTrialEnding(subscription);
                    break;
                case 'checkout.session.expired':
                    subscription = event.data.object;
                    status = subscription.status;
                    handleRemoveUnsuccessfulPayment(subscription)
                    // Then define and call a method to handle the subscription trial ending.
                    // handleSubscriptionTrialEnding(subscription);
                    break;
                case 'customer.subscription.trial_will_end':
                    subscription = event.data.object;
                    status = subscription.status;
                    // console.log(`Subscription status is ${status}.`);
                    // Then define and call a method to handle the subscription trial ending.
                    // handleSubscriptionTrialEnding(subscription);
                    break;
                case 'customer.subscription.deleted':
                    subscription = event.data.object;
                    status = subscription.status;
                    if (status == 'canceled') {
                        changeSub(subscription)
                    }
                    // console.log(`Subscription status is ${status}.`);
                    // Then define and call a method to handle the subscription deleted.
                    // handleSubscriptionDeleted(subscriptionDeleted);
                    break;
                case 'customer.subscription.created':
                    subscription = event.data.object;
                    status = subscription.status;
                    // Then define and call a method to handle the subscription created.
                    // handleSubscriptionCreated(subscription);
                    break;
                case 'customer.subscription.updated':
                    subscription = event.data.object;
                    status = subscription.status;
                    changeSub(subscription)
                    // console.log(`Subscription status is ${status}.`);
                    // Then define and call a method to handle the subscription update.
                    // handleSubscriptionUpdated(subscription);
                    break;
                default:
                // Unexpected event type
                // console.log(`Unhandled event type ${event.type}.`);
            }
            // Return a 200 response to acknowledge receipt of the event
            response.send();
        }
    );

    router.get('/get_all_stores_subscriptions', verifyJWT, async (req, res) => {
        try {
            const { admin_id, store_access_ids } = req.query;

            if (req.role === 'Admin') {
                const result = await all_stores_collection.find({ admin_id: admin_id }, { projection: { store_name: 1, subscription_plan: 1, subscription_type: 1, session_id: 1 } }).sort({ date: -1 }).toArray()

                if (result.length) {
                    res.status(200).json({ data: result, message: "Successfully get all store subscriptions" })
                }
                else {
                    res.status(204).json({ message: "No data found" })
                }
            }
            if (req.role === 'Store Owner') {
                const access_ids = store_access_ids.map(id => new ObjectId(id))
                const result = await all_stores_collection.find({ _id: { $in: access_ids } }, { projection: { store_name: 1, subscription_plan: 1, subscription_type: 1, session_id: 1 } }).sort({ date: -1 }).toArray()

                if (result.length) {
                    res.status(200).json({ data: result, message: "Successfully get all accessed store subscriptions" })
                }
                else {
                    res.status(204).json({ message: "No data found" })
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    })
}
run()

module.exports = router;