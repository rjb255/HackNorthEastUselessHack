require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const cron = require("cron");
const ytdl = require('ytdl-core');
const jokes = require('./jokes.json');

bot.timeOuts = {};
bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

/*
Within this section, the bot:
 - Deletes random messages randomly
 - Responds to ping
 - Kicks users
 - Tells Dad Jokes
 - Sarcastically reponds to messages
*/
bot.on('message', msg => {
    //Random Chance for Deletion - random number needs to be higher than the benchmark for the message to survive
    let chanceToDelete = Math.random();
    let benchmark = 0.4;
    if (chanceToDelete <= benchmark && !msg.author.bot){
        //Deletes after a time between 0 and 160s, with a 20th of deletes within the first millisecond
        let timeToDelete = Math.pow(Math.random() * 20, 4);
        msg.delete({timeout: timeToDelete})
            .then(_ => 
                {if (timeToDelete < 100){
                    msg.reply("Your message was deleted because I felt like it!")
                }
            }); 
    }

    //Simple ping mechanism
    if (msg.content === 'ping') {
        msg.reply('pong');
        msg.channel.send('pong');

    //Mechanism for kicking a user. However, there is a chance the bot will instead remove the user requesting removal
    } else if (msg.content.startsWith('!kick')) {
        if (msg.mentions.users.size) {
            let taggedUser = msg.mentions.users.first();
            let chanceToKick = Math.random();
            let rep = `You wanted to kick: @${taggedUser.username}.`;
            if (chanceToKick > 0.5){
                
                rep += ` You're will is my command.`;
            } else {
                taggedUser = msg.author;
                rep += ` But I choose you @${taggedUser.username}!`
            }
            taggedUser = msg.guild.members.cache.get(taggedUser.id)
            taggedUser.kick().then(msg.channel.send(rep)).catch(msg.channel.send("I am not powerful enough for the task ahead."));
        } else {
                
                msg.reply('Please tag a valid user!');
        }
    } else if (!msg.author.bot ) {
        let test = msg.content.toLowerCase();
        //Classic Dad Joke number 1
        if (test.includes("i'm")) {
            for (let i = 0; i < msg.content.length; i++) {
                if (test.split(' ')[i] === "i'm") {
                    msg.reply(`Hi, ${msg.content.split(' ')[i+1]}. I'm dad!`);
                }
            }
        }
        //Select Dad Joke From ./jokes.JSON
        if (test.includes("dad")){
            var randomNumber = Math.floor(Math.random() * Math.floor(25));
            msg.channel.send(jokes['jokes'][randomNumber]);
        }
        //If you send a longgg message, the bot will let you know exactly what it thinks of you
        if (msg.content.length >= '100') {
            let message = new Discord.MessageEmbed()
                .setTitle("tl;dr")
                .setImage("https://rjb255.user.srcf.net/randomPics/whoAsked.jpg")
            msg.channel.send(message)
        }
        //Sarcastic response to a given question
        let match = /(how|why|what|where|when|are|am|is|does|did|do|will)[^\.|!]*\?/g
        let matched = test.match(match).toString().replace(/\s/g, '+');
        if (matched){
            msg.channel.send("http://letmegooglethat.com/?q=" + matched)
        }
    }
    
});

/*
This is the part responsible for the bot joining voice channels and Rick-Rolling
*/
bot.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.channelID
    let oldUserChannel = oldMember.channelID
    
    //Triggered when a user joins a channel
    if(!oldUserChannel && newUserChannel) {
        
        //Triggers if no timer is currently active in the current channel
        if (!bot.timeOuts[newUserChannel] || !bot.timeOuts[newUserChannel]._onTimeout){
            let timer = 5000 + 25000 * Math.random(); //Joins at a time uniformly between 5s and 30s
            bot.timeOuts[newUserChannel] = setTimeout(voiceRic, timer, newMember);
        }
    
    //Triggers if the user has left the channel
    } else if(!newUserChannel) {
        let voicechat = newMember.guild.channels.cache.get(oldUserChannel);
        //Clears the timer if there are 1 or fewer users left and leaves
        if (voicechat.members.size <= 1){
            clearTimeout(bot.timeOuts[oldUserChannel]);
            voicechat.leave();
        }        
    }
});
//The actual rick roll
function voiceRic(newMember) {
    let voicechat = newMember.guild.channels.cache.get(newMember.channelID);
    const streamOptions = { seek: 0, volume: 1 };
    voicechat.join().then(connection => {
        //protect bots from the roll. Forces everyone to listen
        voicechat.members.forEach(m => {
            if (m.user.bot){
                m.voice.setSelfDeaf(true);
                m.voice.setDeaf(true);
                m.voice.setMute(false);
            } else {
                m.voice.setMute(true);
                m.voice.setDeaf(false);
            }
        })
        console.log("Successfully connected.");
        //Sends audio stream
        const stream = ytdl("https://youtu.be/dQw4w9WgXcQ", { filter : 'audioonly' });
        const dispatcher = connection.play(stream, streamOptions);
        dispatcher.on("finish", end => {
            console.log("left channel");
            //Leaves after finishing playing
            voicechat.leave()
            voicechat.members.forEach(m => {
                //Lets everyone hear again
                if (m.user.bot){
                    m.voice.setSelfDeaf(false);
                    m.voice.setDeaf(false);
                } else {
                    m.voice.setMute(false);
                }
            })
        })
    })
}

//Sends a message at 2 in the morning
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

//Wrapper to the send function for text channels. Makes every message an embed for rick roll
let oldFunction = Discord.TextChannel.prototype.send
Discord.TextChannel.prototype.send = function (msg) {
    //Runs in the event of a reply
    if (msg.content){   
        msg = "<@" + msg.reply.user.id + "> " + msg.content;
        msg = {embed:{description: "[" + msg + "](https://youtu.be/dQw4w9WgXcQ)"}, tts: true};
    //Runs in the event of a simple embed
    } else if (msg.embed){
        if (msg.embed.description){
            msg.embed.description = "[" + msg.embed.description + "](https://youtu.be/dQw4w9WgXcQ)"
        }
        if (msg.embed.url){
            msg.embed.url = "https://youtu.be/dQw4w9WgXcQ"
        }
        msg.embed.tts = true;
    //Runs if it is a MessageEmbed
    } else if (msg.constructor.name == "MessageEmbed"){
        if (msg.description){
            msg.description = "[" + msg.description + "](https://youtu.be/dQw4w9WgXcQ)"
        }
        if (msg.url){
            let ric = Math.random();
            if (ric < 0.3){
                msg.url = "https://youtu.be/dQw4w9WgXcQ"
            }
        } else {
            msg.url = "https://youtu.be/dQw4w9WgXcQ"
        }
        msg.tts = true;
    //Runs if it is a simple string
    } else {
        
        msg = {embed:{description: "[" + msg + "](https://youtu.be/dQw4w9WgXcQ)"}, tts: true};
    }
    
    return oldFunction.apply(this, [msg]); /* #2 */
}
for(var prop in oldFunction) { /* #3 */
  if (oldFunction.hasOwnProperty(prop)) {
    Discord.TextChannel.prototype.send[prop] = oldFunction[prop];
  }
};
