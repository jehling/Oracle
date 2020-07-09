const { ALProxy } = require('./ALProxy');

class Tracker{
    constructor(){
        this.trackedMediaIds = new Map();
    }

    get mediaIds(){
        return this.trackedMediaIds.keys();
    }

    track(mediaId){
        if(!this.trackedMediaIds.has(mediaId)){
            this.trackedMediaIds.set(mediaId, true);
        }
    }

    untrack(mediaId){
        this.trackedMediaIds.delete(mediaId);
    }

    hasTitle(mediaId){
        return this.trackedMediaIds.has(mediaId);
    }
}

// EXPORTS
module.exports = { Tracker };