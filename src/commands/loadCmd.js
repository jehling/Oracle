const { prefix } = require('../../json_files/config.json');

module.exports = {
    name: 'load',
    desc: "Load the tracker's backup list of MediaIds",
    syntax: `${prefix}load`,
    execute(message, args, tracker){
        tracker.load().then(responseString => message.channel.send(responseString));
    },
}
