const { prefix } = require('../../json_files/config.json');

module.exports = {
    name: 'untrack',
    desc: "Untrack a show using the given AniList MediaID",
    syntax: `${prefix}untrack [showID]`,
    execute(message, args, tracker){
        let mediaId = args[0];
        message.channel.send(tracker.untrack(mediaId));
    },
}
