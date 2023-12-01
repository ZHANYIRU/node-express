const express = require("express");
const router = express.Router();
const axios = require("axios");
const linebot = require("linebot");
require("dotenv").config();
const { CHANNEL_ID, CHANNEL_SECRET, CHANNEL_ACCESS_TOKEN, RATE } = process.env;
const bot = linebot({
  channelId: CHANNEL_ID,
  channelSecret: CHANNEL_SECRET,
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
});

const getExchangeRate = async () => {
  const { data } = await axios.get(
    `https://openexchangerates.org/api/latest.json?app_id=${RATE}`
  );
  return data;
};

bot.on("message", async (req) => {
  let money = {};
  const userText = req.message.text;
  if (userText.indexOf("匯率") > -1) {
    money = await getExchangeRate();
    req.reply(`
  美金：${money.rates["USD"]}
  台幣：${money.rates["TWD"]}
  日幣：${money.rates["JPY"]}`);
  } else {
    req.reply(`你剛剛輸入${userText}`);
  }

  // TWD = 31.1845
  // USD = 1
  // JPY = 147.27316667
});

bot.listen("/linewebhook", 3000, function () {
  console.log("[BOT已準備就緒]");
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/test", async (req, res) => {
  money = await getExchangeRate();
  console.log(money);
  res.json(money);
});

module.exports = router;
