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

    } else if (msg.content.startsWith('!kick')) {
        if (msg.mentions.users.size) {
            const taggedUser = msg.mentions.users.first();
            msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
        } else {
            msg.reply('Please tag a valid user!');
        }
    }
});


Discord.TextChannel.prototype.send = (function(){
    let rickroll = Discord.TextChannel.prototype.send;
    return function(msg) {
        return rickroll("(" + msg + ")[https://youtu.be/dQw4w9WgXcQ]");
    }
})();



    //return(Discord.TextChannel.prototype.send.call("(" + msg + ")[https://youtu.be/dQw4w9WgXcQ]")); };

// channel.send = function(msg){
//     console.log(JSON.stringify(this))
// }