const config = require('../json_files/config.json');
const Discord = require('discord.js');
const { CommandClient } = require('./CommandClient');

// Server Data Structure
let serverMap = new Map();

// Discord.js
// https://discord.js.org/#/
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.token);

client.on('message', message => {
    // Setup Server & Process Commands
    if(CommandClient.isCommand(message)){
        if(message.guild.available){
            let guildID = message.guild.id;
            if(!serverMap.has(guildID)){
                serverMap.set(guildID, new CommandClient());
            }
            serverMap.get(guildID).execute(message);
        }
    }
});
