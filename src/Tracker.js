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
const NO_CUR_TRACK_STRING = "No shows are being tracked.";
const AIR_TODAY_STRING = "**Airing Today**";
const NO_AIR_TODAY_STRING = "No shows are airing today.";
const CMD_IGN_STRING = "**Command Ignored**";
const CMD_IGN_INVALID_ID_STRING = "Invalid Media ID. Please only enter an integer > 0";
const CMD_IGN_ERROR_STRING = "ERROR: Unknown state detected.";
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

    getNumIds(){
        return this.getMediaIds().length;
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

    async printAirTodayList(){
        let airingMediaIdList = await this.getAiringTodayList();
        let printString = this.listToString(airingMediaIdList, AIR_TODAY_STRING);
        return (printString.length > 0? printString : NO_AIR_TODAY_STRING);
    }

    async isAiringToday(mediaId){
        let showObj = await ALProxy.searchShowId(mediaId);
        let showDate = new Date(showObj.nextAiringEpisode.airingAt * 1000);
        let localDate = new Date();
        return showDate.getDay() == localDate.getDay() && showDate.getMonth() == localDate.getMonth() && showDate.getFullYear() == localDate.getFullYear();
    }

    async getAiringTodayList(){
        let airingTodayList = [];
        for (const mediaId of this.getMediaIds()){
            let isAiring = await this.isAiringToday(mediaId);
            if(isAiring) airingTodayList.push(mediaId);
        }
        return airingTodayList;
    }

    async track(mediaId){
        // Error Checking
        let errPrintout = `${CMD_IGN_STRING}: \`${mediaId}\` - `;
        if(this.getNumIds() >= TRACKED_SHOW_LIMIT){
            return errPrintout + `**TRACK LIMIT REACHED -** \`${this.getNumIds()}/${TRACKED_SHOW_LIMIT} Active Shows.\``;
        } else if(!this.isValidMediaId(mediaId)){
            return errPrintout + CMD_IGN_INVALID_ID_STRING;
        } else if(this.hasMediaId(mediaId)){
            return errPrintout + "Media already being tracked.";
        }
        // Execution
        let show = await ALProxy.searchShowId(mediaId);
        if(show && show.status == AIRING_STATUS.RELEASING){
            this.trackedMediaIds.set(mediaId, show.title);
            return `**Now Tracking:** ${this.showToString(mediaId)}`;
        } else if(show && show.status != AIRING_STATUS.RELEASING){
            return errPrintout + `Media Status \`${show.status} != ${AIRING_STATUS.RELEASING}\``;
        }
        return errPrintout + CMD_IGN_ERROR_STRING;
    }

    untrack(mediaId){
        // Error Checking
        let errPrintout = `${CMD_IGN_STRING}: \`${mediaId}\` - `;
        if(!this.isValidMediaId(mediaId)){
            return errPrintout + CMD_IGN_INVALID_ID_STRING;
        } else if(!this.hasMediaId(mediaId)){
            return errPrintout + "Media not currently being tracked.";
        }
        // Execution
        let responseString = `**Untracked:** ${this.showToString(mediaId)}`;
        this.trackedMediaIds.delete(mediaId);
        return responseString;
    }

    async refreshMediaIds(){
        for (const mediaId of this.getMediaIds()){
            let showObj = await ALProxy.searchShowId(mediaId);
            if(showObj.status != AIRING_STATUS.RELEASING){
                console.log(`**Refreshed: No longer airing** - ${this.showToString(mediaId)}`);
                this.trackedMediaIds.delete(mediaId);
            }
        }
    }
}

// EXPORTS
module.exports = { Tracker };