// Imports
const config = require('./config.json');
const { Tracker } = require("./Tracker");

// Constants
// Commands (safe manual imports but not scalable)
const leskinenCmd = require("./commands/leskinenCmd");
const trackCmd = require("./commands/trackCmd");
const untrackCmd = require("./commands/untrackCmd");
const listCmd = require("./commands/listCmd");
const airtodayCmd = require("./commands/airtodayCmd");
const cronCmd = require('./commands/cronCmd');
// Local command map
const _commandMap = new Map([
    [`${leskinenCmd.name}`, leskinenCmd],
    [`${trackCmd.name}`, trackCmd],
    [`${untrackCmd.name}`, untrackCmd],
    [`${listCmd.name}`, listCmd],
    [`${airtodayCmd.name}`, airtodayCmd],
    [`${cronCmd.name}`, cronCmd]
]);

/**
 * Abstracted layer for handling commands
 * New Command Procedure: 
 * - Add command to list of imports
 * - Update _commandMap with new key-val pair
 */
class CommandClient {
    constructor(){
        this.tracker = new Tracker();
    }

    static isCommand(message){
        return message.content.startsWith(config.prefix) && !message.author.bot;
    }

    parseMessage(message){
        const processedMsg = message.content.trim().toLowerCase();
        const args = processedMsg.slice(config.prefix.length).split(/\s+/);
        const command = args.shift();
        return {args: args, command: command};
    }

    execute(message){
        let parsedMessage = this.parseMessage(message);
        try{
            if(parsedMessage.command === "help"){
                this.help(message, parsedMessage.args);
            } else if(!_commandMap.has(parsedMessage.command)){
                throw new Error("Command not found.");
            } else{
                _commandMap.get(parsedMessage.command).execute(message, parsedMessage.args, this.tracker);
            } 
        } catch (error){
            message.reply(error.message);
        }
    }

    help(message, args){
        if(args.length == 0){
            let header = "For more details, enter \`help commandName\`.\n";
            let cmdPrintout = `**Command List:**\n`;
            for (const cmd of _commandMap.values()){
                cmdPrintout += `**|-** \`${cmd.name} : ${cmd.description}\`\n`;
            }
            message.reply(header + cmdPrintout);
        } else{
            // todo
        }
    }
}

module.exports = { CommandClient };
