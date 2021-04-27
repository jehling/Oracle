module.exports = {
    name: 'untrack',
    description: "Untrack a show using the given AniList MediaID",
    execute(message, args, tracker){
        let mediaId = args[0];
        message.channel.send(tracker.untrack(mediaId));
    },
}
