const cron = require("node-cron");
const {
  subscriptionMonthComplete,
  // subscriptionCommisionAtlastMonth,
  subscriptionInterest,
  // subscriptionWithDrawRequest,
  // subscriptionCommision,
  // subscriptionCommision,
  // generatePastInvoice,
} = require("../service/Crone/crone");

exports.CronCall = async function () {
  // EVERY 1 , 11 & 21 date of every month at 12 am  0 0 1,11,21 * *
  // for every one minute * * * * *
  cron.schedule("0 1 1,11,21 * *", () => {
    subscriptionMonthComplete()
      .then((res) => {
        console.log(res, "case1");
        subscriptionInterest()
          .then((res) => {
            console.log(res, "case2");
            // generatePastInvoice()
            //   .then((res) => {
            //     console.log(res, "case3");
            //   })
            //   .catch((error) => {
            //     console.log(error, "check error pdf generation");
            //   });
            // subscriptionWithDrawRequest()
            //   .then((res) => {
            //     console.log(res, "case3");
            // subscriptionCommision()
            //   .then((res) => {
            //     console.log(res, "case4");
            //   })
            //   .catch((err) => {
            //     console.log(err, "case4");
            //   });
            // })
            // .catch((err) => {
            //   console.log(err, "case3");
            // });
          })
          .catch((err) => {
            console.log(err, "case2");
          });
      })
      .catch((err) => {
        console.log(err, "case1");
      });
    // generatePastInvoice()
    //   .then((res) => {
    //     console.log(res, "check46");
    //   })
    //   .catch((err) => {
    //     console.log(err, "case49");
    //   });
    console.log("Cron Working");
  });
};
