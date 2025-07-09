const express = require("express");
const paymentController = require("../controllers/paymentControllers");
const auth = require("../middlewares/auth");
const validationMiddleware = require("../middlewares/validateRequest");
const { paymentSchema } = require("../JoiValidations/paymentJoiSchema");

const paymentRoute = express.Router();
paymentRoute.post("/create-product/:package_id", paymentController.createProduct);
paymentRoute.post("/create-customer", validationMiddleware.validate(paymentSchema.createCustomerSchema, "body"), paymentController.createCustomer);
paymentRoute.post("/create-subscription", validationMiddleware.validate(paymentSchema.createpaymentSchema, "body"), paymentController.createSubscription);
paymentRoute.post("/webhook", paymentController.autoPayment);
paymentRoute.post("/store-credit-card-details", paymentController.storeCreditCardDetails);
paymentRoute.get("/get-payment-details", auth.authenticate(), paymentController.getPaymentDetails);
paymentRoute.get("/get-payment-details-for-transaction", auth.authenticate(), paymentController.getPaymentDetailsForTransaction);

paymentRoute.get("/get-company-transaction-history", auth.authenticate(), paymentController.getCompanyTransactionHistory);
//ADD VALIDATION
paymentRoute.post("/razorpay-payment", paymentController.razorPayPayment);
// paymentRoute.post("/payment-verification", paymentController.verifyPayment);
paymentRoute.post("/razorpay-webhook", paymentController.razorPayWebhook);

module.exports = paymentRoute;
