const express = require("express");
const router = express.Router();
require("dotenv").config();
const linebot = require("linebot");
const { CHANNEL_ID, CHANNEL_SECRET, CHANNEL_ACCESS_TOKEN } = process.env;
const bot = linebot({
  channelId: CHANNEL_ID,
  channelSecret: CHANNEL_SECRET,
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
});

bot.on("message", (req) => {
  const userText = req.message.text;
  console.log(userText);
  req.reply(`剛剛說${userText}`);
});

bot.listen("/linewebhook", 3000, function () {
  console.log("[BOT已準備就緒]");
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
