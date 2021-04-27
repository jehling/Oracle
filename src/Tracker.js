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

    isValidMediaId(mediaId){
        let intMediaId = Number(mediaId);
        return Number.isInteger(intMediaId) && intMediaId > 0;
    }

    getShowTitle(mediaId){
        let titleObj = this.trackedMediaIds.get(mediaId);
        return titleObj.english? titleObj.english : titleObj.romaji;
    }

    showToString(mediaId){
        return `\`${mediaId}\`: "${this.getShowTitle(mediaId)}"`;
    }

    listToString(mediaIdList, listTitle = ""){
        let listString = "";
        if(mediaIdList && mediaIdList.length > 0){
            listString = listTitle;
            for (const mediaId of mediaIdList){
                listString += `\n**| -** ${this.showToString(mediaId)}`;
            }
        }
        return listString;
    }

    printTrackingList(){
        let printString = this.listToString(this.getMediaIds(), "**Currently Tracking**");
        return (printString.length > 0? printString : "No shows are currently being tracked.");
    }

    async track(mediaId){
        if(!this.hasMediaId(mediaId) && this.isValidMediaId(mediaId)){
            let show = await ALProxy.searchShowId(mediaId);
            if(show && show.status == AIRING_STATUS.RELEASING){
                this.trackedMediaIds.set(mediaId, show.title);
                return `**Now Tracking:** ${this.showToString(mediaId)}`;
            } 
        }
    }

    untrack(mediaId){
        if(this.hasMediaId(mediaId)){
            let responseString = `**Untracked:** ${this.showToString(mediaId)}`;
            this.trackedMediaIds.delete(mediaId);
            return responseString;
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
                console.log(`**Untracked: No Longer Airing - ** ${this.showToString(mediaId)}`);
                this.trackedMediaIds.delete(mediaId);
            }
        }
    }
}

// EXPORTS
module.exports = { Tracker };