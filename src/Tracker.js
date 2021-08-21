// Imports
const { ALProxy } = require('./ALProxy');
const fs = require('fs').promises;

// Constants
const OUTPUT_DIR = "./json_files/";
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
    constructor(guid){
        this.mediaMap = new Map();
        this.guid = guid;
    }

    getMedia(mediaId){
        return this.mediaMap.get(mediaId);
    }

    setMedia(key, val){
        this.mediaMap.set(key, val);
    }

    deleteMedia(mediaId){
        this.mediaMap.delete(mediaId);
    }

    hasMedia(mediaId){
        return this.mediaMap.has(mediaId);
    }

    getMediaIds(){
        return Array.from(this.mediaMap.keys());
    }

    getNumIds(){
        return this.getMediaIds().length;
    }

    isValidMediaId(mediaId){
        let intMediaId = Number(mediaId);
        return Number.isInteger(intMediaId) && intMediaId > 0;
    }

    getShowTitle(mediaId){
        let titleObj = this.getMedia(mediaId);
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

    printShowCount(){
        return `(${this.getNumIds()}/${TRACKED_SHOW_LIMIT})`;
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
        let showDate = new Date(showObj.nextAiringEpisode.airingAt);
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
        if(this.getNumIds() >= TRACKED_SHOW_LIMIT){
            return `${CMD_IGN_STRING}: **TRACK LIMIT REACHED ${this.printShowCount()}.** Please untrack one or more to make room.`;
        } else if(!this.isValidMediaId(mediaId)){
            return `${CMD_IGN_STRING}: ${CMD_IGN_INVALID_ID_STRING}`;
        } else if(this.hasMedia(mediaId)){
            return `${CMD_IGN_STRING}: Media already being tracked.`;
        }
        // Execution
        let show;
        try{
            show = await ALProxy.searchShowId(mediaId);
        } catch (err){
            return `${err.name}: ${err.message}`;
        }
        if(show && show.status == AIRING_STATUS.RELEASING){
            this.setMedia(mediaId, show.title);
            return `**Now Tracking ${this.printShowCount()}:** ${this.showToString(mediaId)}.`;
        } else if(show && show.status != AIRING_STATUS.RELEASING){
            return `${CMD_IGN_STRING}: Media Status \`${show.status} != ${AIRING_STATUS.RELEASING}\``;
        }
        return `${CMD_IGN_STRING}: ${CMD_IGN_ERROR_STRING}`;
    }

    untrack(mediaId){
        // Error Checking
        if(!this.isValidMediaId(mediaId)){
            return `${CMD_IGN_STRING}: ${CMD_IGN_INVALID_ID_STRING}`;
        } else if(!this.hasMedia(mediaId)){
            return `${CMD_IGN_STRING}: Media not currently being tracked.`;
        }
        // Execution
        let untrackedShowStr = this.showToString(mediaId);
        this.deleteMedia(mediaId);
        let responseString = `**Untracked ${this.printShowCount()}:** ${untrackedShowStr}.`;
        return responseString;
    }

    async refreshMediaIds(){
        let refreshStr = (this.getMediaIds().length > 0? "**Refreshed Show List (No Longer Airing)**" : "");
        for (const mediaId of this.getMediaIds()){
            let showObj = await ALProxy.searchShowId(mediaId);
            if(showObj.status != AIRING_STATUS.RELEASING){
                refreshStr += `\n|- ${this.showToString(mediaId)}`;
                this.deleteMedia(mediaId);
            }
        }
        return refreshStr;
    }

    async save(){
        let mediaIdList = [];
        for(const mediaId of this.mediaMap.keys()){
            mediaIdList.push(mediaId);
        }
        let data = JSON.stringify(mediaIdList);
        try{
            await fs.writeFile(OUTPUT_DIR + `${this.guid}_backup.json`, data);
            return "Success: saved tracked show list.";
        } catch (error){
            console.log(error);
            return "ERROR: Failed to save tracked show list.";
        }
    }

    async load(){
        const data = await fs.readFile(OUTPUT_DIR + `${this.guid}_backup.json`);
        let backupIdList = JSON.parse(data);
        try{
            backupIdList.map(mediaId => this.track(mediaId));
            return "Success: loaded tracked show list.";
        } catch (error){
            console.log(error);
            return "ERROR: Failed to load tracked show list.";
        }
    }
}

// EXPORTS
module.exports = { Tracker };