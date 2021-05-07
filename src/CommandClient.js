// Imports
const config = require('./config.json');
const { Tracker } = require("./Tracker");

// Constants
// Commands (safe manual imports but not scalable)
const leskinenCmd = require("./commands/leskinenCmd");
const trackCmd = require("./commands/trackCmd");
const untrackCmd = require("./commands/untrackCmd");
const listCmd = require("./commands/listCmd");
const airingCmd = require("./commands/airingCmd");
// Local command map
const _commandMap = {
    [leskinenCmd.name]: leskinenCmd,
    [trackCmd.name]: trackCmd,
    [untrackCmd.name]: untrackCmd,
    [listCmd.name]: listCmd,
    [airingCmd.name]: airingCmd,
};
// Data Model
const tracker = new Tracker();

/**
 * Abstracted layer for handling commands
 * New Command Procedure: 
 * - Add command to list of imports
 * - Update _commandMap with new key-val pair
 */
class CommandClient {
    static hasCommand(command){
        return _commandMap[command] != undefined;
    }

    static isCommand(message){
        return message.content.startsWith(config.prefix) && !message.author.bot;
    }

    static parseMessage(message){
        const args = message.content.slice(config.prefix.length).trim().split(/\s+/);
        const command = args.shift().toLowerCase();
        return {args: args, command: command};
    }

    static execute(message){
        let parsedMessage = this.parseMessage(message);
        try{
            if(!this.hasCommand(parsedMessage.command)) return;
            _commandMap[parsedMessage.command].execute(message, parsedMessage.args, tracker);
        } catch (error){
            message.reply(error.message);
        }
    }
}

module.exports = { CommandClient };
