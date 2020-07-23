const config = require('./config.json');
const { Tracker } = require("./Tracker");
// Commands (manual imports because blind loading is scary)
const jeremyCmd = require("./commands/jeremyCmd");
const leskinenCmd = require("./commands/leskinenCmd");
const trackCmd = require("./commands/trackCmd");
// Local command map
const _commandMap = {
    [jeremyCmd.name]: jeremyCmd,
    [leskinenCmd.name]: leskinenCmd,
    [trackCmd.name]: trackCmd,
};
// Data Model
const tracker = new Tracker();

/**
 * Abstracted layer for command handling logic
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
            message.reply('Error: Invalid command args');
        }
    }
}

module.exports = { CommandClient };
