// Imports
const config = require('../json_files/config.json');
const { Tracker } = require("./Tracker");

// Constants
// Commands (safe manual imports but not scalable)
const leskinenCmd = require("./commands/leskinenCmd");
const trackCmd = require("./commands/trackCmd");
const untrackCmd = require("./commands/untrackCmd");
const listCmd = require("./commands/listCmd");
const airtodayCmd = require("./commands/airtodayCmd");
const cronCmd = require('./commands/cronCmd');
const helpCmd = require('./commands/helpCmd');
const saveCmd = require('./commands/saveCmd');
const loadCmd = require('./commands/loadCmd');

// Local command map
const _commandMap = new Map([
    [`${leskinenCmd.name}`, leskinenCmd],
    [`${trackCmd.name}`, trackCmd],
    [`${untrackCmd.name}`, untrackCmd],
    [`${listCmd.name}`, listCmd],
    [`${airtodayCmd.name}`, airtodayCmd],
    [`${cronCmd.name}`, cronCmd],
    [`${helpCmd.name}`, helpCmd],
    [`${saveCmd.name}`,saveCmd],
    [`${loadCmd.name}`,loadCmd]
]);

/**
 * Abstracted layer for handling commands
 * New Command Procedure: 
 * - Add command to list of imports
 * - Update _commandMap with new key-val pair
 */
class CommandClient {
    constructor(){
        this.trackerMap = new Map();
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
            if(!_commandMap.has(parsedMessage.command)) throw new Error("Command not found.");
            let cmd = _commandMap.get(parsedMessage.command);
            if(cmd.name === "help"){
                cmd.execute(message, parsedMessage.args, _commandMap);
            } else{
                cmd.execute(message, parsedMessage.args, this.getTracker(message));
            }
        } catch (error){
            message.reply(error.message);
        }
    }

    setTracker(message){
        this.trackerMap.set(message.guild.id, new Tracker(message.guild.id));
    }

    getTracker(message){
        return this.trackerMap.get(message.guild.id);
    }

    hasTracker(message){
        return this.trackerMap.has(message.guild.id);
    }

    deleteTracker(message){
        this.trackerMap.delete(message.guild.id);
    }
}

module.exports = { CommandClient };
