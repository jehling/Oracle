module.exports = {
    name: 'track',
    description: "Track a show using the given AniList MediaID",
    execute(message, args, tracker){
        let mediaId = args[0];
        tracker.track(mediaId).then(responseString => { 
            if(responseString) message.channel.send(responseString);
        });
    },
}
