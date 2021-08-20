const Discord = require('discord.js')
const intents = new Discord.Intents(32767)
const client = new Discord.Client({ intents })
require('dotenv').config()

client.on('ready', () => {
    console.log(`Currenetly logged in as ${client.user.tag}.`)
})

client.on('message', message => {
    if(message.content == 'run') {
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Message Stats for ' + message.member.displayName)
        .setThumbnail(message.author.avatarURL())
        .setTimestamp()
        message.channel.send({ embeds: [exampleEmbed] });
    }

});

client.login(process.env.TOKEN)