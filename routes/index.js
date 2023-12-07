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

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

bot.on("message", async (req) => {
  let money = {};
  let TWD = 0;
  let JPY = 0;
  let USD = 0;
  let KRW = 0;
  let resText = "";
  const userText = req.message.text;
  const currency = userText?.slice(-3);

  if (userText.indexOf("匯率") > -1) {
    money = await getExchangeRate();
    TWD = money.rates["TWD"] / money.rates["TWD"];
    JPY = (money.rates["JPY"] / money.rates["TWD"]).toFixed(3);
    USD = (money.rates["USD"] * money.rates["TWD"]).toFixed(3);
    KRW = (money.rates["KRW"] / money.rates["TWD"]).toFixed(3);
    resText = `台幣：${TWD}
美金：${USD}
日幣：${JPY}
韓元：${KRW}`;
  } else if (currency === "JPY") {
    const moneyNumber = userText.replace(currency, "");
    const numberReg = /^\d+$/;
    if (numberReg.test(moneyNumber)) {
      money = await getExchangeRate();
      JPY = (money.rates["JPY"] / money.rates["TWD"]).toFixed(3);
      resText = `台幣：${(+moneyNumber / JPY).toFixed(3)}`;
    } else {
      resText = "金額錯誤";
    }
  } else {
    resText = `你剛剛輸入${userText}`;
  }
  req.reply(resText);
});

bot.listen("/linewebhook", 3000, function () {
  console.log("[BOT已準備就緒]");
});

router.get("/test", async (req, res) => {
  money = await getExchangeRate();
  console.log(money);
  res.json(money);
});

module.exports = router;
