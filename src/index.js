const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.token);

client.on('message', message => {
    if(message.content.startsWith(`${config.prefix}leskinen`)) message.channel.send('Where are the shaman girls, Rintaro.');
});
