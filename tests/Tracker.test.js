// Testing Class
const { Tracker } = require('../src/Tracker');

// Testing Constants
let tracker;
const testALID = '1';
const testTitleObj = {
    english: 'Cowboy Beebop',
    romaji: 'COWBOY BEEBOP'
};
const testShowString = `\`${testALID}\`: "${testTitleObj.english}"`;
const testListString = `\n**| -** ${testShowString}`;
const testTrackString = `**Currently Tracking**` + `${testListString}`;
const testNoTrackString = `No shows currently being tracked.`;
const testAirString = `**Currently Airing**` + `${testListString}`;
const testNoAirString = `No shows currently airing.`;
// Mocks

// Tests
describe('Tracker Suite', () => {
    // SETUP & TEARDOWN
    beforeEach(() => {
        // TODO mock reset logic
        tracker = new Tracker();
        tracker.trackedMediaIds.set(testALID, testTitleObj);
    });
    
    // TESTS
    test('getMediaIds', () => {
        expect(tracker.getMediaIds()).toStrictEqual([testALID]);
        tracker.trackedMediaIds.clear();
        expect(tracker.getMediaIds()).toHaveLength(0);
    });

    test('hasMediaId', () => {
        expect(tracker.hasMediaId(testALID)).toBeTruthy();
        tracker.trackedMediaIds.clear();
        expect(tracker.hasMediaId(testALID)).toBeFalsy();
    });

    test('isValidMediaId', () => {
        expect(tracker.isValidMediaId('abc')).toBeFalsy();
        expect(tracker.isValidMediaId(0)).toBeFalsy();
        expect(tracker.isValidMediaId(-1)).toBeFalsy();
        expect(tracker.isValidMediaId(testALID)).toBeTruthy();
    });

    test('getShowTitle', () => {
        expect(tracker.getShowTitle(testALID)).toEqual(testTitleObj.english);
        let tracker2 = new Tracker();
        tracker2.trackedMediaIds.set(testALID, { romaji: testTitleObj.romaji });
        expect(tracker2.getShowTitle(testALID)).toEqual(testTitleObj.romaji);
    });

    test('showToString', () => {
        let testString = `\`${testALID}\`: "${testTitleObj.english}"`;
        expect(tracker.showToString(testALID)).toEqual(testString);
    });

    test('listToString', () => {
        expect(tracker.listToString([testALID])).toEqual(testListString);
        tracker.trackedMediaIds.clear();
        expect(tracker.listToString([])).toEqual("");
    });

    test('printTrackingList', () => {
        expect(tracker.printTrackingList()).toEqual(testTrackString);
        tracker.trackedMediaIds.clear();
        expect(tracker.printTrackingList()).toEqual(testNoTrackString);
    });

    test('printAiringList', () => {
        // TODO
    });

    test('isAiringToday', () => {
        // TODO
    });

    test('getAiringTodayList', () => {
        // TODO
    });

    test('track', () => {
        // TODO
    });

    test('untrack', () => {
        // TODO
    });

    test('refreshMediaIds', () => {
        // TODO
    });
});

