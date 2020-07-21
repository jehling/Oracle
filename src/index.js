const config = require('./config.json');
const Discord = require('discord.js');
const jeremyCmd = require('./commands/jeremyCmd');
const leskinenCmd = require('./commands/leskinenCmd');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.commands.set(jeremyCmd.name, jeremyCmd);
client.commands.set(leskinenCmd.name, leskinenCmd);

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.token);

client.on('message', message => {
    // Reject early if not a command
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;  
    // Parse command message  
    const args = message.content.slice(config.prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    // Attempt execution
    try{
        client.commands.get(command).execute(message, args);
    } catch (error){
        // console.error(error);
        message.reply('Error: Invalid Command');
    }
});
