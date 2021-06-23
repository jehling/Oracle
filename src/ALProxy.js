// Imports
const fetch = require('node-fetch');

// Constants
const AL_ENDPOINT = "https://graphql.anilist.co";
const AL_REQUEST_BODY = 
    `id
    status
    siteUrl
    title{
        romaji
        english
        native
    }
    nextAiringEpisode{
        episode
        airingAt
        timeUntilAiring
    }`;

/**
 * Proxy class for interfacing with the AniList API
 */
class ALProxy {
    /**
     * Private helper function. 
     * Generates a MediaQuery search request using the AniListID
     * Assumption: Passed valid numeric ID
     * @param {*} showId - AniList integer ID for a show
     */
    static _buildRequestBody_IDSearch(showId){
        let queryBody = `query ($id: Int){
            Media (id: $id, type: ANIME){
                ${AL_REQUEST_BODY}
            }
        }`;

        // define query variables to be used in the request
        let variables = {
            id: showId
        };

        // save query and variables to JSON object
        let request_body = {
            "query": queryBody,
            "variables": variables
        };

        return request_body;
    }

    /**
     * Private helper function.
     * Generates a MediaQuery search request using a show title
     * ASSUMPTION: Passed safe string for Show Title
     * @param {*} showTitle - string representation of a show title
     */
    static _buildRequestBody_TitleSearch(showTitle){
        let queryBody = `query ($search: String){
            Media (search: $search, type: ANIME){
                ${AL_REQUEST_BODY}
            }
        }`;

        // define query variables to be used in the request
        let variables = {
            search: showTitle
        };

        // save query and variables to JSON object
        let requestBody = {
            "query": queryBody,
            "variables": variables
        };

        return requestBody;
    }

    /**
     * Private helper function. Assembles the payload sent to the AniList API
     * Pass in response from respective "buildRequestBody" function
     * @param {*} requestBody - query and variables for respective request
     */
    static _assemblePayload(requestBody){
        let payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(requestBody)
        };
        return payload;
    }

    /**
     * Public method
     * Make a MediaQuery request to the AniList API using a show's AniList ID
     * @param {*} showId - Integer AniList ID
     */
    static async searchShowId(showId){
        let intMediaId = Number(showId);
        if(!Number.isInteger(intMediaId) || intMediaId < 0){
            let err = new Error("Invalid AniList ID. Please provide an Integer");
            err.name = "AniListError";
            throw err;
        }
        let requestBody = this._buildRequestBody_IDSearch(intMediaId);
        let payload = this._assemblePayload(requestBody);
        let response = await fetch(AL_ENDPOINT, payload);
        let response_json = await response.json();
        if(response_json.errors){
            let topError = response_json.errors[0];
            let err = new Error();
            err.message = (topError.status == "404"? `${topError.status} - Show not found.` : `${topError.status} - ${topError.message}`);
            err.name = "AniListError";
            throw err;
        }
        // Adjust AniList epoch time (seconds) for JavaScript (milliseconds)
        // NOTE: nextAiringEpisode field is null when show is not airing
        let mediaObj = response_json.data.Media;
        if(mediaObj.nextAiringEpisode) mediaObj.nextAiringEpisode.airingAt = mediaObj.nextAiringEpisode.airingAt * 1000;
        return mediaObj;
    }
}

// Exports
module.exports = {ALProxy};