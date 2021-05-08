// Testing Class
const { Tracker } = require('../src/Tracker');

// Testing Constants
let tracker;
const testALID = '1';
const testTitleObj = {
    english: 'Cowboy Beebop',
    romaji: 'COWBOY BEEBOP'
};

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
});

