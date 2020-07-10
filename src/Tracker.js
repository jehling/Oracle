const { ALProxy } = require('./ALProxy');

class Tracker{
    constructor(){
        this.trackedMediaIds = new Map();
    }

    get mediaIds(){
        return this.trackedMediaIds.keys();
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
            if(show){
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

    hasMediaId(mediaId){
        return this.trackedMediaIds.has(mediaId);
    }
}

// EXPORTS
module.exports = { Tracker };