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

    getShowTitle(mediaId){
        let titleObj = this.trackedMediaIds.get(mediaId);
        return titleObj.english? titleObj.english : titleObj.romaji;
    }

    isValidMediaId(mediaId){
        return Number.isInteger(mediaId) && mediaId > 0;
    }

    async track(mediaId){
        if(!this.hasMediaId(mediaId) && this.isValidMediaId(mediaId)){
            let show = await ALProxy.searchShowId(mediaId);
            if(show && show.status == AIRING_STATUS.RELEASING){
                this.trackedMediaIds.set(mediaId, show.title);
                let showTitle = show.title.english? show.title.english : show.title.romaji;
                console.log(`Now Tracking: ${mediaId} - ${showTitle}`);
            } 
        }
    }

    untrack(mediaId){
        if(this.hasMediaId(mediaId)){
            console.log(`Untracked: ${mediaId} - ${this.getShowTitle(mediaId)}`);
            this.trackedMediaIds.delete(mediaId);
        }
    }

    isAiringToday(showObj){
        let showDate = new Date(showObj.nextAiringEpisode.airingAt * S_TO_MS);
        let localDate = new Date();
        return showDate.getMonth() == localDate.getMonth() && showDate.getDate() == localDate.getDate() && showDate.getFullYear() == localDate.getFullYear();
    }

    async getAiringTodayList(){
        let airingTodayList = [];
        for (const mediaId of this.getMediaIds()){
            let showObj = await ALProxy.searchShowId(mediaId);
            if(this.isAiringToday(showObj)){
                airingTodayList.push(showObj);
            }
        }
        return airingTodayList;
    }

    async refreshMediaIds(){
        for (const mediaId of this.getMediaIds()){
            let showObj = await ALProxy.searchShowId(mediaId);
            if(showObj.status != AIRING_STATUS.RELEASING){
                console.log(`Untracked: ${mediaId} - "${this.getShowTitle(mediaId)}" because it is no longer airing.`);
                this.trackedMediaIds.delete(mediaId);
            }
        }
    }
}

// EXPORTS
module.exports = { Tracker };