// Imports
const { ALProxy } = require('./ALProxy');

// Constants
const AIRING_STATUS = {
    FINISHED: "FINISHED",
    RELEASING: "RELEASING",
    NOT_YET_RELEASED: "NOT_YET_RELEASED",
    CANCELLED: "CANCELLED",
};
const CUR_TRACK_STRING = "**Currently Tracking**";
const NO_CUR_TRACK_STRING = "No shows currently being tracked.";
const CUR_AIR_STRING = "**Currently Airing**";
const NO_CUR_AIR_STRING = "No shows currently airing.";
const S_TO_MS = 1000;
const TRACKED_SHOW_LIMIT = 10;

/**
 * Class responsible for all tracking based functions. 
 * Serves as seam between CommandClient and ALProxy
 * This includes: data storage, retrieval, and pruning
 * Also contains printout logic since its the info expert
 */
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
        let printString = this.listToString(this.getMediaIds(), CUR_TRACK_STRING);
        return (printString.length > 0? printString : NO_CUR_TRACK_STRING);
    }

    async printAiringList(){
        let airingMediaIdList = await this.getAiringTodayList();
        let printString = this.listToString(airingMediaIdList, CUR_AIR_STRING);
        return (printString.length > 0? printString : NO_CUR_AIR_STRING);
    }

    async track(mediaId){
        if(!this.hasMediaId(mediaId) && this.isValidMediaId(mediaId)){
            if(this.getMediaIds().length >= TRACKED_SHOW_LIMIT){
                return `**TRACK LIMIT REACHED -** \`${this.getMediaIds().length}/${TRACKED_SHOW_LIMIT} Active Shows.\``;
            }
            let show = await ALProxy.searchShowId(mediaId);
            if(show && show.status == AIRING_STATUS.RELEASING){
                this.trackedMediaIds.set(mediaId, show.title);
                return `**Now Tracking:** ${this.showToString(mediaId)}`;
            } 
        }
        let defaultPrintout = `**NOT TRACKED** - \`${mediaId}\`: `;
        defaultPrintout += this.hasMediaId(mediaId)? "Already being tracked." : "Invalid Media ID. Please only enter a set of integers.";
        return defaultPrintout;
    }

    untrack(mediaId){
        if(this.hasMediaId(mediaId)){
            let responseString = `**Untracked:** ${this.showToString(mediaId)}`;
            this.trackedMediaIds.delete(mediaId);
            return responseString;
        }
        let defaultPrintout = `**NOT UNTRACKED** - \`${mediaId}\`: `;
        defaultPrintout += this.isValidMediaId(mediaId)? "Media not currently being tracked." : "Invalid Media ID. Please only enter a set of integers";
        return defaultPrintout;
    }

    async isAiringToday(mediaId){
        let showObj = await ALProxy.searchShowId(mediaId);
        let showDate = new Date(showObj.nextAiringEpisode.airingAt * S_TO_MS);
        let localDate = new Date();
        return showDate.getDay() == localDate.getDay() && showDate.getMonth() == localDate.getMonth() && showDate.getFullYear() == localDate.getFullYear();;
    }

    async getAiringTodayList(){
        let airingTodayList = [];
        for (const mediaId of this.getMediaIds()){
            let isAiring = await this.isAiringToday(mediaId);
            if(isAiring) airingTodayList.push(mediaId);
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