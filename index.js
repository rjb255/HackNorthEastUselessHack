require('dotenv').config();
const Discord = require('discord.js');
var fs = require('fs')
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

let chanceToDelete = Math.random
let benchmark = 0.2

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
        msg.channel.send('pong');
        console.log()

    } else if (msg.content.startsWith('!kick')) {
        if (msg.mentions.users.size) {
            const taggedUser = msg.mentions.users.first();
            msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
        } else {
            msg.reply('Please tag a valid user!');
        }
    }
    else {
        if (chanceToDelete <= benchmark){
            msg.delete({reason: 'Message was deleted because: ' + getMsgFromFile()})
        }
    }
});

function getMsgFromFile(){
    fs.open('reasons.txt', 'r+', file)

    // 

    fs.close(file)

    return 'this is a test'
}