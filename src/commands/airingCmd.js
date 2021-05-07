module.exports = {
    name: 'airing',
    description: "List all shows that air today",
    execute(message, args, tracker){
        tracker.printAiringList().then(responseString => message.channel.send(responseString));
    },
}
