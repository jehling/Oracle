const { ALProxy } = require('./ALProxy');

class Tracker{
    constructor(){
        this.trackedMediaIds = new Map();
    }

    get mediaIds(){
        return this.trackedMediaIds.keys();
    }

    isValidMediaId(mediaId){
        return Number.isInteger(mediaId) && mediaId > 0;
    }

    async track(mediaId){
        if(!this.hasMediaId(mediaId) && await this.isValidMediaId(mediaId)){
            let show = await ALProxy.searchShowId(mediaId);
            if(show){
                console.log(`Now Tracking: ${mediaId} - ${show.title.english}`);
                this.trackedMediaIds.set(mediaId, true);
            }
        } else{
            console.log("invalid mediaId: ", mediaId);
        }
    }

    untrack(mediaId){
        this.trackedMediaIds.delete(mediaId);
    }

    hasMediaId(mediaId){
        return this.trackedMediaIds.has(mediaId);
    }
}

// EXPORTS
module.exports = { Tracker };