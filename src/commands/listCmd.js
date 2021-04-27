module.exports = {
    name: 'list',
    description: "List all shows currently being tracked",
    execute(message, args, tracker){
        message.channel.send(tracker.printTrackingList());
    },
}
