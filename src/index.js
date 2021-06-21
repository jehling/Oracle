const config = require('./config.json');
const Discord = require('discord.js');
const { CommandClient } = require('./CommandClient');

// Discord.js
// https://discord.js.org/#/
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
