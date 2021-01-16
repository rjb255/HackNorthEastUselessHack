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


});

/*
Discord.TextChannel.prototype.send = (function(msg){
    var rickroll = Discord.TextChannel.prototype.send;
    //return function(msg) {
        return rickroll("(" + msg + ")[https://youtu.be/dQw4w9WgXcQ]");
    //}
});
*/
let oldFunction = Discord.TextChannel.prototype.send

Discord.TextChannel.prototype.send = function (msg) { /* #1 */
  /* work before the function is called */
    try {
        var returnValue = oldFunction.apply(this, ["[" + msg.content + "](https://youtu.be/dQw4w9WgXcQ)"]); /* #2 */
        /* work after the function is called */
        return returnValue;
    }
    catch (e) {
    /* work in case there is an error */
        throw e;
    }
}
for(var prop in oldFunction) { /* #3 */
  if (oldFunction.hasOwnProperty(prop)) {
    Discord.TextChannel.prototype.send[prop] = oldFunction[prop];
  }
}
    //return(Discord.TextChannel.prototype.send.call("(" + msg + ")[https://youtu.be/dQw4w9WgXcQ]")); };

// channel.send = function(msg){
//     console.log(JSON.stringify(this))
// }