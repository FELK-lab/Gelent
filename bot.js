const { Telegraf } = require('telegraf');

const bot = new Telegraf('7739980317:AAHspGO17JICqAX9NgSC2n9EHrpdN0yGBso');

bot.start((ctx) => {
  ctx.reply('Welcome! Click the button below to launch the app.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Launch App', web_app: { url: 'https://ninety-worms-sleep.loca.lt' } }]
      ]
    }
  });
});

bot.launch(); 