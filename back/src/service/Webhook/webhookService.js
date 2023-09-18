const WebhookSchema = require("../../modal/Webhook/webhook");
const UserSubscriptionSchema = require("../../modal/UserSubscription/userSubscription");
const FuturePaymentSchema = require("../../modal/FuturePayment/futurePayment");
const TransactionSchema = require("../../modal/Transaction/transaction");
const UserSchema = require("../../modal/User/user");
const WithdrawalSchema = require("../../modal/Withdrawal/withdrawal");
const NotificationSchema = require("../../modal/Notification/notification");
const CurrencySchema = require("../../modal/Currency/currency");
class WebhookService {
  constructor() {}
  // get user transaction with pagination
  async getOnrampWebhook(payload, res) {
    try {
      let webhookResponse = await WebhookSchema.create({
        response: JSON.stringify(payload),
      });
      let data = await UserSubscriptionSchema.findOne({
        onmeta_orderId: payload?.orderId,
      });
      if (data?.usersubscriptionstatus === "Pending") {
        if (
          !(
            payload.status === "fiatPending" ||
            payload.status === "InProgress" ||
            payload.status === "expired"
          )
        ) {
          data = await UserSubscriptionSchema.findOneAndUpdate(
            {
              onmeta_orderId: payload.orderId,
            },
            {
              usersubscriptionstatus: "Accepted",
            },
            {
              new: true,
            }
          );
          let userNotificationCreate = await NotificationSchema.create({
            userId: data.userId,
            title: `Accepted`,
            body: `Your ${data?.name} subscription is Accepted`,
            n_type: "user",
            n_link: "/packages",
          });

          if (
            payload.status === "orderReceived" ||
            payload.status === "transferred" ||
            payload.status === "completed"
          ) {
            let adminId = await UserSchema.find(
              { is_superadmin: true },
              { _id: 1 }
            );
            let userData = await UserSchema.findOne(
              { _id: data?.userId },
              { referral_user_id: 1, name: 1, email: 1 }
            );
            let userTransactionCreate = await TransactionSchema.create({
              userId: data.userId,
              userSubscriptionId: data?._id,
              transaction_type: "Debit",
              currency: data.currency,
              amount: data.amount,
              currencyId: data.currencyId,
            });
            let adminTransactionCreate = await TransactionSchema.create({
              adminId: adminId[0]?._id,
              userId: data.userId,
              userSubscriptionId: data?._id,
              transaction_type: "Credit",
              currency: data.currency,
              amount: data.amount,
              currencyId: data.currencyId,
            });
            if (userData?.referral_user_id) {
              let userCommisionTransactionData = await TransactionSchema.create(
                {
                  userId: userData?.referral_user_id,
                  userSubscriptionId: data?._id,
                  transaction_type: "Credit",
                  currency: data.currency,
                  amount: (data.amount * data.commision) / 100,
                  currencyId: data.currencyId,
                  payment_type: "commision",
                  referral_user_id: userData?._id,
                  acctual_package_amount: data.amount,
                }
              );
              let adminCommisionTransaction = await TransactionSchema.create({
                adminId: adminId[0]?._id,
                userId: userData?.referral_user_id,
                userSubscriptionId: data?._id,
                transaction_type: "Debit",
                currency: data.currency,
                amount: (data.amount * data.commision) / 100,
                currencyId: data.currencyId,
                payment_type: "commision",
                referral_user_id: userData?._id,
                acctual_package_amount: data.amount,
              });

              let addCommisionInUserWallet = await UserWalletSchema.create({
                userId: userData.referral_user_id,
                userSubscriptionId: data._id,
                amount: (data.amount * data.commision) / 100,
                currencyId: data.currencyId,
              });

              let updateReferralflage =
                await UserSubscriptionSchema.findByIdAndUpdate(
                  { _id: data?._id },
                  {
                    $set: {
                      is_referral_paid: true,
                    },
                  }
                );
            }
            const currentDate = new Date();
            const utcDate = moment.utc(currentDate);
            const formattedDate = utcDate.format("DD");
            let date_start;
            if (Number(formattedDate) >= 11 && Number(formattedDate) <= 20) {
              date_start = 21;
            } else if (
              Number(formattedDate) >= 21 &&
              Number(formattedDate) <= 31
            ) {
              date_start = 1;
            } else if (
              Number(formattedDate) >= 1 &&
              Number(formattedDate) <= 10
            ) {
              const currentDate = moment.utc();
              date_start = 11;
            } else {
              // console.log(formattedDate, "formattedDatecase1");
              return;
            }
            let futurePayment = [];
            let rateofinterest = (data.amount * data.roi) / 100;
            let currency = data.currency;
            if (data.roi_duration === "monthly") {
              let i = 1;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i++;
              }
            } else if (data.roi_duration === "quarterly") {
              let i = 3;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 3;
              }
            } else if (data.roi_duration === "halfyearly") {
              let i = 6;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "######################################"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 6;
              }
            } else if (data.roi_duration === "yearly") {
              let i = 12;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 12;
              }
            } else if (data.roi_duration === "one and half year") {
              let i = 18;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 18;
              }
            } else if (data.roi_duration === "two year") {
              let i = 24;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 24;
              }
            } else if (data.roi_duration === "two and half year") {
              let i = 30;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 30;
              }
            } else if (data.roi_duration === "three year") {
              let i = 36;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 36;
              }
            } else if (data.roi_duration === "three and half year") {
              let i = 42;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 42;
              }
            } else if (data.roi_duration === "four year") {
              let i = 48;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 48;
              }
            } else if (data.roi_duration === "four and half year") {
              let i = 54;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 54;
              }
            } else if (data.roi_duration === "five year") {
              let i = 60;
              while (i <= data?.duration) {
                let next_mont_interest_date;
                if (date_start === 1) {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i + 1, "month")
                    .startOf("day");
                } else {
                  next_mont_interest_date = moment(new Date())
                    .set("date", date_start)
                    .utc()
                    .add(i, "month")
                    .startOf("day");
                }
                // console.log(
                //   next_mont_interest_date,
                //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                // );
                let obj = {
                  userId: data.userId,
                  userSubscriptionId: data._id,
                  roi: rateofinterest,
                  currency: currency,
                  roi_date: next_mont_interest_date,
                  subscriptionId: data.subscriptionId,
                  currencyId: data.currencyId,
                };
                futurePayment.push(obj);
                i += 60;
              }
            }
            if (futurePayment && futurePayment.length > 0) {
              const futurePayout = await FuturePaymentSchema.insertMany(
                futurePayment
              );
            }
            // for dynemic pdf genaration
            let lastpdfserialnumber = await UserSubscriptionSchema.find({
              invoice_number: { $ne: "" },
              $and: [
                { usersubscriptionstatus: { $ne: "Pending" } },
                { usersubscriptionstatus: { $ne: "Rejected" } },
              ],
            })
              .sort({ invoice_number: -1 })
              .limit(1);

            // console.log(lastpdfserialnumber, "check807");
            console.log(lastpdfserialnumber[0]?.invoice_number, "check808");
            function generatePaddedNumber(number, width) {
              return String(number).padStart(width, "0");
            }
            let paddedNumber = generatePaddedNumber(
              Number(lastpdfserialnumber[0]?.invoice_number) + 1,
              6
            );
            console.log(paddedNumber, "check862");
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            let body = await invoiceHtml.MailSent({
              invoiceNumber: paddedNumber,
              invoiceDate: moment(new Date()).format("DD/MM/YYYY"),
              userName: userData?.name,
              packageName: data.name,
              packageDuration: data.duration,
              netAmount: data.amount?.toFixed(2),
              totalAmount: data.amount?.toFixed(2),
              currencyName: data.currency,
            });
            await page.setContent(body);

            await page.pdf({
              path: `uploads/Invoice/Invoice-${paddedNumber}.pdf`,
              format: "A4",
              printBackground: true,
            });
            await browser.close();
            // ??????????????????????????????????????????????????????????????????????????????????????????????????????????
            let updateUserSubscriptionData =
              await UserSubscriptionSchema.findByIdAndUpdate(
                { _id },
                {
                  $set: {
                    invoice_number: paddedNumber,
                  },
                },
                {
                  new: true,
                }
              );
            let purchaseMailBody = await PurchaseEmailTemplate.MailSent({
              username: userData.name,
            });
            await emailhandler.sendEmail(
              userData.email?.toLowerCase(),
              purchaseMailBody,
              "Invoice",
              "",
              [
                {
                  filename: `Invoice-${paddedNumber}.pdf`,
                  path: `${process.env.BACKEND_UPLOAD_DIR}Invoice/Invoice-${paddedNumber}.pdf`,
                  contentType: "application/pdf",
                },
              ]
            );
            let createInvoiceData = await InvoiceSchema.create({
              invoice_name: `Invoice-${paddedNumber}.pdf`,
              invoice_number: paddedNumber,
              userId: ObjectId(updateUserSubscriptionData?.userId),
              usersubscriptionId: ObjectId(updateUserSubscriptionData?._id),
              currencyId: ObjectId(updateUserSubscriptionData?.currencyId),
            });
          }
        } else {
          if (payload.status === "expired") {
            let userNotificationCreate = await NotificationSchema.create({
              userId: data.userId,
              title: `Rejected`,
              body: `Your ${data?.name} subscription is Rejected`,
              n_type: "user",
              n_link: "/packages",
            });

            data = await UserSubscriptionSchema.findOneAndUpdate(
              {
                onmeta_orderId: payload.orderId,
              },
              {
                usersubscriptionstatus: "Rejected",
              },
              {
                new: true,
              }
            );
          }
        }
      }
      return webhookResponse;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }
  async getOfframpWebhook(payload, res) {
    try {
      let webhookResponse = await WebhookSchema.create({
        response: JSON.stringify(payload),
      });

      let data = await WithdrawalSchema.findOne({
        withdrawal_orderId: payload?.orderId,
      });
      // let data = await WithdrawalSchema.findByIdAndUpdate(
      //   { _id },
      //   {
      //     $set: {
      //       status: payload.status,
      //       hash_value: payload.hash_value ? payload.hash_value : "",
      //       remark: payload.remark ? payload.remark : "",
      //       withdrawal_file: filename ? filename : "",
      //     },
      //   },
      //   {
      //     new: true,
      //   }
      // );

      if (data?.notificationId) {
        let notificationStatusChange =
          await NotificationSchema.findByIdAndUpdate(
            { _id: data?.notificationId },
            { $set: { seen: true } }
          );
      }
      let currencyName = await CurrencySchema.findById({
        _id: data?.currencyId,
      });

      if (
        !(
          payload.status === "pending" ||
          payload.status === "InProgress" ||
          payload.status === "refunded"
        )
      ) {
        data = await WithdrawalSchema.findOneAndUpdate(
          {
            withdrawal_orderId: payload?.orderId,
          },
          {
            status: "Accepted",
          },
          { new: true }
        );
        let userNotificationCreate = await NotificationSchema.create({
          userId: data?.userId,
          title: `Accepted`,
          body: `Your withdraw request for ${data.amount} ${currencyName?.name} is Accepted`,
          n_type: "user",
          n_link: "/usertransaction",
        });

        let adminID = await UserSchema.findOne({ is_superadmin: true });
        let userEmailAndName = await UserSchema.findOne(
          { _id: ObjectId(data?.userId) },
          { name: 1, email: 1 }
        );
        let userWalletMinusEntry = await UserWalletSchema.create({
          userId: ObjectId(data?.userId),
          currencyId: data?.currencyId,
          amount: -data?.amount,
          is_withdraw: true,
          userSubscriptionId: null,
        });

        let adminTransactionCreate = await TransactionSchema.create({
          adminId: adminID?._id,
          userId: ObjectId(data.userId),
          userSubscriptionId: null,
          transaction_type: "Debit",
          amount: data?.amount,
          currencyId: payload.currencyId,
          currency: currencyName.name,
        });
        let body = await WithdrawEmailTemplate.MailSent({
          username: userEmailAndName.name,
        });

        await emailhandler.sendEmail(
          userEmailAndName.email,
          body,
          "Withdrawal",
          "",
          [],
          "",
          res
        );
      } else {
        let userNotificationCreate = await NotificationSchema.create({
          userId: data?.userId,
          title: `Rejected`,
          body: `Your withdraw request for ${data.amount} ${currencyName?.name} is Rejected`,
          n_type: "user",
          n_link: "/usertransaction",
        });
        data = await WithdrawalSchema.findOneAndUpdate(
          {
            withdrawal_orderId: payload?.orderId,
          },
          {
            status: "Rejected",
          },
          { new: true }
        );
      }
      return webhookResponse;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }

  async getKycWebhook(payload, res) {
    try {
      let webhookResponse = await WebhookSchema.create({
        response: JSON.stringify(payload),
      });
      return webhookResponse;
    } catch (error) {
      console.log(error, "60");
      throw new Error(error);
    }
  }
}

module.exports = new WebhookService();
