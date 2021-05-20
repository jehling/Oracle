module.exports = {
    name: 'airtoday',
    description: "List all shows that air today",
    execute(message, args, tracker){
        tracker.printAirTodayList().then(responseString => message.channel.send(responseString));
    },
}
