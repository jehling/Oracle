const { prefix } = require('../../json_files/config.json');

module.exports = {
    name: 'list',
    desc: "List all shows currently being tracked",
    syntax: `${prefix}list`,
    execute(message, args, tracker){
        message.channel.send(tracker.printTrackingList());
    },
}
