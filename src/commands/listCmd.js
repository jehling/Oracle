const { prefix } = require('../config.json');

module.exports = {
    name: 'list',
    desc: "List all shows currently being tracked",
    syntax: `${prefix}list`,
    execute(message, args, tracker){
        message.channel.send(tracker.printTrackingList());
    },
}
