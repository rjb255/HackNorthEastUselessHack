require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const cron = require("cron");


bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
   // console.log(msg.channel.send().toString());
    let chanceToDelete = Math.random();
    let benchmark = 0.4;
    if (chanceToDelete <= benchmark){
        
        let timeToDelete = Math.pow(Math.random() * 20, 4);
        if (timeToDelete < 100){
            msg.channel.send("Your message was deleted because I felt like it!")
        }
        msg.delete({timeout: timeToDelete})
            .then(_ => 
                {if (timeToDelete < 100){
                    msg.reply.send("Your message was deleted because I felt like it!")
                }
            }); //Deletes after a time between 0 and 160s, with a 20th of deletes within the first millisecond
    }
    if (msg.content === 'ping') {
        msg.reply('pong');
        msg.channel.send('pong');
    } else if (msg.content.startsWith('!kick')) {
        if (msg.mentions.users.size) {
            const taggedUser = msg.mentions.users.first();
            let chanceToKick = Math.random();
            let rep = `You wanted to kick: @${taggedUser.username}.`;
            if (chanceToKick > 0.5){
                
                rep += ` You're will is my command.`;
            } else {
                taggedUser = msg.author;
                rep += ` But I choose you @${taggedUser.username}!`
            }
            taggedUser.kick().then(msg.channel.send(rep)).catch(msg.channel.send("I am not powerful enough for the task ahead."));
        } else {
                
                msg.reply('Please tag a valid user!');
        }
    }
    
});



let scheduledMessage = new cron.CronJob('00 00 2 * * *', () => {
    const channel = msg.channel;
    channel.send("@everyone WAKE UP");
});

scheduledMessage.start();

let oldFunction = Discord.TextChannel.prototype.send
Discord.TextChannel.prototype.send = function (msg) {
    if (msg.content){
        msg = "<@" + msg.reply.user.id + "> " + msg.content;
    }
    return oldFunction.apply(this, [{embed:{description: "[" + msg + "](https://youtu.be/dQw4w9WgXcQ)"}, tts: true}]); /* #2 */
}
for(var prop in oldFunction) { /* #3 */
  if (oldFunction.hasOwnProperty(prop)) {
    Discord.TextChannel.prototype.send[prop] = oldFunction[prop];
  }
};
