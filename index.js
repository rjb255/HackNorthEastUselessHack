require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const cron = require("cron");
const ytdl = require('ytdl-core');
const jokes = require('./jokes.json');


bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);

    setInterval(() => {
        
        var randomNumber = Math.floor(Math.random() * Math.floor(25));
        testChannel.send(jokes['jokes'][randomNumber]);
        
    }, 60000);
});

bot.on('message', msg => {
   // console.log(msg.channel.send().toString());
    let chanceToDelete = Math.random();
    let benchmark = 0.4;
    if (chanceToDelete <= benchmark && !msg.author.bot){
        
        let timeToDelete = Math.pow(Math.random() * 20, 4);
        if (timeToDelete < 100){
            msg.channel.send("Your message was deleted because I felt like it!")
        }
        msg.delete({timeout: timeToDelete})
            .then(_ => 
                {if (timeToDelete < 100){
                    msg.reply("Your message was deleted because I felt like it!")
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

    if (msg.content.includes("I'm")) {
        for (let i = 0; i < msg.content.length; i++) {
            if (msg.content.split(' ')[i] === "I'm") {
                msg.reply(`Hi, ${msg.content.split(' ')[i+1]}. I'm dad!`);
            }
        }
     }
    
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.channelID
    let oldUserChannel = oldMember.channelID
    
    if(!oldUserChannel && newUserChannel) {
        let voicechat = newMember.guild.channels.cache.get(newUserChannel);
        console.log(voicechat);
        const streamOptions = { seek: 0, volume: 1 };
        voicechat.join().then(connection => {
            
            console.log("Successfully connected.");
            const stream = ytdl("https://www.youtube.com/watch?v=NSKHc_iLKhI&ab_channel=MIKAVEVO", { filter : 'audioonly' });
            const dispatcher = connection.play(stream, streamOptions);
            dispatcher.on("end", end => {
                console.log("left channel");
                voicechat.leave();
            })
        })
        
    } else if(oldUserChannel) {
        let voicechat = newMember.guild.channels.cache.get(oldUserChannel);
        voicechat.leave();
    }
});


let scheduledMessage = new cron.CronJob('00 00 2 * * *', () => {
    bot.guilds.cache.forEach(server => {
        server.channels.cache.forEach(c => {
            if (c.type == "text"){
                c.send("@everyone WAKE UP").catch(_ => {console.error("My permissions are lacking.")});
            }
        })
    });    
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
