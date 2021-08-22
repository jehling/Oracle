const { prefix } = require('../../json_files/config.json');

module.exports = {
    name: 'help',
    desc: "List all supported commands.",
    syntax: `${prefix}help [commandName]`,
    execute(message, args, cmdMap){
        if(args.length == 0){
            let header = "For more specific info, try \`help commandName\`.\n";
            let cmdPrintout = `**Command List:**\n`;
            for (const cmd of cmdMap.values()){
                cmdPrintout += `|- \`${cmd.name}\`: ${cmd.desc}\n`;
            }
            message.reply(header + cmdPrintout);
        } else{
            let cmdName = args[0];
            if(!cmdMap.has(cmdName)) throw new Error(`Command \`${cmdName}\` not found.`);
            let cmd = cmdMap.get(cmdName);
            let header = `\n**Command:** \`${cmd.name}\`\n`;
            let syntax = `|- Syntax: \`${cmd.syntax}\`\n`;
            let desc = `|- Desc: \`${cmd.desc}\`\n`;
            message.reply(header + syntax + desc);
        }
    },
}
