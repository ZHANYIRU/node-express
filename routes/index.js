const express = require("express");
const router = express.Router();
const axios = require("axios");
// const linebot = require("linebot");
const line = require("@line/bot-sdk");
require("dotenv").config();
const { CHANNEL_ID, CHANNEL_SECRET, CHANNEL_ACCESS_TOKEN, RATE } = process.env;
// const bot = linebot({
//   channelId: CHANNEL_ID,
//   channelSecret: CHANNEL_SECRET,
//   channelAccessToken: CHANNEL_ACCESS_TOKEN,
// });

const config = {
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CHANNEL_SECRET,
};
const client = new line.Client(config);
const getExchangeRate = async () => {
  const { data } = await axios.get(
    `https://openexchangerates.org/api/latest.json?app_id=${RATE}`
  );
  return data;
};

// bot.on("message", async (req) => {
//   let money = {};
//   const userText = req.message.text;
//   if (userText.indexOf("匯率") > -1) {
//     money = await getExchangeRate();
//   }

//   // TWD = 31.1845
//   // USD = 1
//   // JPY = 147.27316667

//   console.log(userText);
//   req.reply(`
//   美金：${money.rates["USD"]}
//   台幣：${money.rates["TWD"]}
//   日幣：${money.rates["JPY"]}`);
// });

// bot.listen("/linewebhook", 3000, function () {
//   console.log("[BOT已準備就緒]");
// });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/linewebhook", line.middleware(config), async (req, res) => {
  // bot.on("message", async (event) => {
  //   let money = {};
  //   const userText = event.message.text;
  //   if (userText.indexOf("匯率") > -1) {
  //     money = await getExchangeRate();
  //   }

  //   // TWD = 31.1845
  //   // USD = 1
  //   // JPY = 147.27316667

  //   console.log("userText", userText);
  //   event.reply(`
  //   美金：${money.rates["USD"]}
  //   台幣：${money.rates["TWD"]}
  //   日幣：${money.rates["JPY"]}`);
  // });
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
  // res.render("index", { title: "line bot" });
});

async function handleEvent(event) {
  if (event.type === "message" && event.message.type === "text") {
    const userText = event.message.text;
    let replyText = "";

    if (userText.indexOf("匯率") > -1) {
      const money = await getExchangeRate();
      replyText = `
          美金：${money.rates["USD"]}
          台幣：${money.rates["TWD"]}
          日幣：${money.rates["JPY"]}`;
    } else {
      replyText = "收到訊息：" + userText;
    }

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: replyText,
    });
  }
}

router.get("/test", async (req, res) => {
  money = await getExchangeRate();
  console.log(money);
  res.json(money);
});

module.exports = router;
