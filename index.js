const Discord = require('discord.js')
const intents = new Discord.Intents(32767)
const client = new Discord.Client({ intents })
const fetchAll = require('discord-fetch-all')
require('dotenv').config()

let setupDone = false

client.on('ready', () => {
    console.log(`Currenetly logged in as ${client.user.tag}.`)
})

client.on('message', message => {
    if(message.content == 'setup') {
        if(!setupDone) {
            firstTimeSetup(message)
            setupDone = true
        }
    }
    if(message.content == 'stats') {
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Message Stats for ' + message.member.displayName)
        .setThumbnail(message.author.avatarURL())
        .setTimestamp()
        message.channel.send({ embeds: [exampleEmbed] });
    }
});

async function firstTimeSetup(message) {
    // get all members and setup variables
    const members = []
    const guildMembers = client.guilds.cache.get(message.guild.id);
    guildMembers.members.cache.each(member => {
        if(member.user.bot == false) {
            const user = {
                username : member.user.username,
                id : member.user.id,
                messageCount : 0,
            }
            members.push(user)
        }
    })
    // fetch all channels from current guild
    const channelIds = []
    message.guild.channels.cache.forEach(channel => {
        if(channel.isText()) {
            channelIds.push(channel.id)
        }
    })
    // count all messages
    // Note: messages are stored in allMessages, acccess as you would like an array
    for(let i = 0; i < channelIds.length; i++) {
        message.channel.send('Currently scanning channel ' + channelIds[i])
        const allMessages = await fetchAll.messages(message.guild.channels.cache.get(channelIds[i]), {
            userOnly: true,
            reverseArray: true,
        })
        for(let j = 0; j < allMessages.length; j++) {
            if(j % 100 == 0) {
                message.channel.send('Currently on message ' + j + ' in channel ' + channelIds[i])
            }
            for(let k = 0; k < members.length; k++) {
                if(allMessages[j].author.id == members[k].id) {
                    members[k].messageCount += 1
                }
            }
        }
    }
    for(let k = 0; k < members.length; k++) {
        message.channel.send(members[k].username + ' has sent a total of ' + members[k].messageCount + ' messages!')
    }
    // message.channel.send(`Message ${i} with value '` + allMessages[i].content + '\' by user ' + allMessages[i].author.username)

}

client.login(process.env.TOKEN)