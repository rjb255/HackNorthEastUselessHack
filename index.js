require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
   // console.log(msg.channel.send().toString());
    let chanceToDelete = Math.random();
    let benchmark = 0.2;
    if (chanceToDelete <= benchmark){
        msg.delete();
    }
    if (msg.content === 'ping') {
        msg.reply('pong');
        msg.channel.send('pong');
    }
});

let oldFunction = Discord.TextChannel.prototype.send
Discord.TextChannel.prototype.send = function (msg) {
    if (msg.content){
        msg = "<@" + msg.reply.user.id + "> " + msg.content;
    }
    return oldFunction.apply(this, [{embed:{description: "[" + msg + "](https://youtu.be/dQw4w9WgXcQ)"}}, {tts: true}]); /* #2 */
}
for(var prop in oldFunction) { /* #3 */
  if (oldFunction.hasOwnProperty(prop)) {
    Discord.TextChannel.prototype.send[prop] = oldFunction[prop];
  }
}