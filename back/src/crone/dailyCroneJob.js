const cron = require("node-cron");
const { lastDayDailyRoi, dailyRoi } = require("../service/Crone/dailyCrone");

exports.DailyCronCall = async function () {
  // EVERY 1 , 11 & 21 date of every month at 12 am  0 0 1,11,21 * *
  // for every one minute * * * * *
  cron.schedule("0 1 * * *", async () => {
    await lastDayDailyRoi()
      .then((res) => {
        console.log(res, "check9dailycrone");
      })
      .catch((error) => {
        console.log(error, "checkerror11dailycrone");
      });

    await dailyRoi()
      .then((res) => {
        console.log(res, "check17dailycrone");
      })
      .catch((error) => {
        console.log(error, "checkerror20dailycrone");
      });
    // generatePastInvoice()
    //   .then((res) => {
    //     console.log(res, "check46");
    //   })
    //   .catch((err) => {
    //     console.log(err, "case49");
    //   });
    console.log("Daily Cron Working");
  });
};
