const { prefix } = require('../config.json');

module.exports = {
    name: 'airtoday',
    desc: "List all shows that air today",
    syntax: `${prefix}airtoday`,
    execute(message, args, tracker){
        tracker.printAirTodayList().then(responseString => message.channel.send(responseString));
    },
}
