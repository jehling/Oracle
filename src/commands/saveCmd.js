const { prefix } = require('../../json_files/config.json');

module.exports = {
    name: 'save',
    desc: "Backup a tracker's list of MediaIds",
    syntax: `${prefix}save`,
    execute(message, args, tracker){
        tracker.save().then(responseString => message.channel.send(responseString));
    },
}
