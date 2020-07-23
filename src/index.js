const config = require('./config.json');
const Discord = require('discord.js');
const { CommandClient } = require('./CommandClient');

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.token);

client.on('message', message => {
    // Process potential command message
    if(CommandClient.isCommand(message)){
        CommandClient.execute(message);
    }
});
