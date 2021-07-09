const { prefix } = require('../config.json');
const LESKINEN_URL = "https://static.wikia.nocookie.net/steins-gate/images/4/4b/SG0Leskinen.png/revision/latest?cb=20180718221344";

module.exports = {
    name: 'leskinen',
    desc: "Ask Professor Leskinen what's on his mind.",
    syntax: `${prefix}leskinen`,
    execute(message, args, tracker){
        message.channel.send(LESKINEN_URL);
        message.channel.send('Where are the shaman girls, Rintaro.');
    },
}
