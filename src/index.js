const { token } = require('../json_files/config.json');
const { Client, Intents } = require('discord.js');
const { CommandClient } = require('./CommandClient');

// Discord.js
// https://discord.js.org/#/
const discordClient = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]});
const cc = new CommandClient();

discordClient.login(token);

discordClient.once('ready', () => {
    console.log("ORACLE ONLINE. LOOKING COOL JOKER!");
});

discordClient.on('messageCreate', async message => {
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
