const cron = require("node-cron");
const { removeUserTokens } = require("../service/Crone/oneminuteCrone");

exports.OneminuteCronCall = async function () {
  // EVERY 1 , 11 & 21 date of every month at 12 am  0 0 1,11,21 * *
  // for every one minute * * * * *
  cron.schedule("* * * * *", async () => {
    await removeUserTokens()
      .then((res) => {
        console.log(res, "check10oneminutecrone");
      })
      .catch((error) => {
        console.log(error, "checkerror13oneminutecrone");
      });

    // await dailyRoi()
    //   .then((res) => {
    //     console.log(res, "check17dailycrone");
    //   })
    //   .catch((error) => {
    //     console.log(error, "checkerror20dailycrone");
    //   });
    // generatePastInvoice()
    //   .then((res) => {
    //     console.log(res, "check46");
    //   })
    //   .catch((err) => {
    //     console.log(err, "case49");
    //   });
    console.log("one minute Cron Working");
  });
};
