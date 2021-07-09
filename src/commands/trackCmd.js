const { prefix } = require('../config.json');

module.exports = {
    name: 'track',
    desc: "Track a show using the given AniList MediaID",
    syntax: `${prefix}track [showID]`,
    execute(message, args, tracker){
        let mediaId = args[0];
        tracker.track(mediaId).then(responseString => message.channel.send(responseString));
    },
}
