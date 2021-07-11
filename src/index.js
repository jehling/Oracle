const config = require('../json_files/config.json');
const Discord = require('discord.js');
const { CommandClient } = require('./CommandClient');

// Discord.js
// https://discord.js.org/#/
const client = new Discord.Client();
const cc = new CommandClient();

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.token);

client.on('message', message => {
    // Setup Server & Process Commands
    if(CommandClient.isCommand(message)){
        if(message.guild.available){
            if(!cc.hasTracker(message)){
                cc.setTracker(message);
            }
            cc.execute(message);
        }
    }
});
