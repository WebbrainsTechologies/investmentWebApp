const express = require("express"); // call express
const app = express(); // define our app using express
const superAdminRoutes = require("./SuperAdmin");
const userRoutes = require("./User");
const subscriptionRoutes = require("./Subscription");
const currencyRoutes = require("./Currency");
const durationRoutes = require("./Duration");
const userSubscriptionRoutes = require("./UserSubscription");
const notificationRoutes = require("./Notification");
const transactionRoutes = require("./Transaction");
const futurePaymentRoutes = require("./FuturePayment");
const DashboardRoutes = require("./Dashboard");
const KycRoutes = require("./Kyc");
const UserWalletRoutes = require("./UserWallet");
const UserDetailRoutes = require("./UserDetails");
const WebhookRoutes = require("./Webhook");
const WithdrawalRoutes = require("./Withdrawal");
const onmetalogsRoutes = require("./Onmetalogs");
const MyteamRoutes = require("./Myteam");
const InvoiceRoutes = require("./Invoice");

app.use("/admin", superAdminRoutes);
app.use("/user", userRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/currency", currencyRoutes);
app.use("/duration", durationRoutes);
app.use("/usersubscription", userSubscriptionRoutes);
app.use("/notification", notificationRoutes);
app.use("/transaction", transactionRoutes);
app.use("/futurepayment", futurePaymentRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/kyc", KycRoutes);
app.use("/userwallet", UserWalletRoutes);
app.use("/userdetails", UserDetailRoutes);
app.use("/userwithdrawal", WithdrawalRoutes);
app.use("/webhook", WebhookRoutes);
app.use("/onmetalogs", onmetalogsRoutes);
app.use("/myteamapi", MyteamRoutes);
app.use("/invoiceapi", InvoiceRoutes);

module.exports = app;
