// Imports
const fetch = require('node-fetch');

// Constants
const AL_ENDPOINT = "https://graphql.anilist.co";
const AL_REQUEST_BODY = 
    `id
    status
    siteUrl
    episodes
    startDate{
        day
        month
        year
    }
    endDate{
        day
        month
        year
    }
    title{
        romaji
        english
        native
    }
    nextAiringEpisode{
        episode
        airingAt
    }`;

/**
 * Proxy class for interfacing with the AniList API
 */
class ALProxy{
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
    static searchShowId(showId){
        if(isNaN(showId)){
            throw Error("Invalid AniList ID: Please provide an Integer");
        }
        let requestBody = this._buildRequestBody_IDSearch(showId);
        let payload = this._assemblePayload(requestBody);
        let response = fetch(AL_ENDPOINT, payload)
            .then(response => response.json())
            .then(response_json => response_json.data.Media)
            .catch(error => console.error(error));
        return response;
    }
}

// Exports
module.exports = {ALProxy};