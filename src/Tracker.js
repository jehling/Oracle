const { ALProxy } = require('./ALProxy');

const AIRING_STATUS = {
    FINISHED: "FINISHED",
    RELEASING: "RELEASING",
    NOT_YET_RELEASED: "NOT_YET_RELEASED",
    CANCELLED: "CANCELLED",
};
const S_TO_MS = 1000;

class Tracker{
    constructor(){
        this.trackedMediaIds = new Map();
    }

    getMediaIds(){
        return Array.from(this.trackedMediaIds.keys());
    }

    hasMediaId(mediaId){
        return this.trackedMediaIds.has(mediaId);
    }

    getshowTitle(mediaId){
        return this.trackedMediaIds.get(mediaId);
    }

    isValidMediaId(mediaId){
        return Number.isInteger(mediaId) && mediaId > 0;
    }

    async track(mediaId){
        if(!this.hasMediaId(mediaId) && await this.isValidMediaId(mediaId)){
            let show = await ALProxy.searchShowId(mediaId);
            if(show && show.status == AIRING_STATUS.RELEASING){
                console.log(`Now Tracking: ${mediaId} - ${show.title.english}`);
                this.trackedMediaIds.set(mediaId, show.title.english);
            }
        } else{
            console.log("Failed to track invalid mediaId: ", mediaId);
        }
    }

    untrack(mediaId){
        if(this.hasMediaId(mediaId)){
            console.log(`Untracked: ${mediaId} - ${this.getshowTitle(mediaId)}`);
            this.trackedMediaIds.delete(mediaId);
        } else{
            console.log("Failed to untrack missing mediaId: ", mediaId);
        }
    }

    isAiringToday(showObj){
        let showDate = new Date(showObj.nextAiringEpisode.airingAt * S_TO_MS);
        let localDate = new Date();
        return showDate.getMonth() == localDate.getMonth() && showDate.getDate() == localDate.getDate() && showDate.getFullYear() == localDate.getFullYear();
    }

    async getAiringTodayList(){
        let airingTodayList = [];
        await this.getMediaIds().forEach(async (mediaId) => {
            let showObj = await ALProxy.searchShowId(mediaId);
            if(this.isAiringToday(showObj)){
                airingTodayList.push(showObj);
            }
        });
        return airingTodayList;
    }
}

// EXPORTS
module.exports = { Tracker };