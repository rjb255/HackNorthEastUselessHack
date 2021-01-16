require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
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
    } else if (msg.author.bot === false) {
        var luckyNumber = 777;
        var random = Math.random();
        if (random <= luckyNumber) {
            msg.delete({ timeout: 5000});
            msg.channel.send("Your message was deleted because I felt like it!")
    }}

    // Discord.TextChannel.prototype.send(msg) => Discord.TextChannel.prototype.send("(" + msg + ")[https://youtu.be/dQw4w9WgXcQ]");

    
    
});