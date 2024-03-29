// Imports
const { prefix } = require('../../json_files/config.json');
// https://github.com/node-schedule/node-schedule
const Scheduler = require('node-schedule');

// Data Structs
const CRON_RULE = new Scheduler.RecurrenceRule();
CRON_RULE.hour = 0;
CRON_RULE.minute = 0;
CRON_RULE.second = 0;
const CRON_MODE = {
    ENABLE: "enable",
    DISABLE: "disable",
}
var cronJob = null;

module.exports = {
    name: 'cron',
    desc: "Toggle scheduled printout of shows airing that day",
    syntax: `${prefix}cron [enable | disable]`,
    execute(message, args, tracker){
        switch(args[0]){
            case CRON_MODE.ENABLE:
                if(!cronJob){
                    try{
                        cronJob = Scheduler.scheduleJob(CRON_RULE, function(){
                            tracker.refreshMediaIds()
                            .then(refreshStr => message.channel.send(refreshStr))
                            .then(printAirTodayList)
                            .then(airTodayStr => message.channel.send(airTodayStr));
                        });
                        message.channel.send("Cron job enabled.");
                    } catch(error){
                        console.error(error);
                    }
                } else{
                    message.channel.send(`Cron job already enabled.`);
                }
                break;
            case CRON_MODE.DISABLE:
                if(cronJob){
                    cronJob.cancel();
                    cronJob = null;
                    message.channel.send("Cron job disabled.");
                } else{
                    message.channel.send("There is no cron job to disable.");
                }
                break;
            default:
                message.channel.send(`**INVALID ARGUMENT:** Please enter \`${CRON_MODE.ENABLE}\` or \`${CRON_MODE.DISABLE}\` after the \`${this.name}\` command`);
        }
    },
}
