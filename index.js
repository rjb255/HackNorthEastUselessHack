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
    }

    var randomNumber = Math.random();
    const messageWords = message.content.split(' ');
    const benchmarkNumber = 7;

    if (messageWords) {
        var randomNumber = Math.random();
        if (randomNumber < benchmarkNumber) {
            message.delete({ timeout: 5000 })
            message.channel.send("You're the weakest link. Goodbye.")
        }
    }  
    
});