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

    if (msg.mentions.users.size) {
        const taggedUser = msg.mentions.users.first();
        let chanceToKick = Math.random();
        let rep = `You wanted to kick: @${taggedUser.username}.`;
        if (chanceToKick > 0.5){            
            rep += ` You're will is my command.`;
        } else {
            taggedUser = msg.author;
            rep += ` But I choose you @${taggedUser.username}!`
        } taggedUser.kick().then(msg.channel.send(rep)).catch(msg.channel.send("I am not powerful enough for the task ahead."));
    }

    // Time goes from 'seconds minutes hour(24hr)' * * * makes it so that it repeats every day
    let scheduledMessage = new cron.CronJob('00 00 2 * * *', () => {
        const channel = msg.channel;
        channel.send("@everyone WAKE UP");
    });
    
    scheduledMessage.start();
    
    
});