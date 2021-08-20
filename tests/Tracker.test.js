// Testing Class
const { Tracker } = require('../src/Tracker');
const { ALProxy } = require('../src/ALProxy');

// Mocks
jest.mock('../src/ALProxy');
const mockShowObj = {
    id: 1,
    title: {
        english: 'Cowboy Beebop',
        romaji: 'COWBOY BEEBOP'
    },
    nextAiringEpisode: {
        airingAt: Date.now(),
    },
    status: "RELEASING",
};
const mockNAShowObj = {
    ...mockShowObj,
    id: 2,
    title: {
        english: 'Naruto',
        romaji: 'NARUTO'
    },
    nextAiringEpisode: {
        airingAt: 0,
    },
    status: "FINISHED",
};

// Setup
let tracker;

// Constants
const testShowString = `\`${mockShowObj.id}\`: "${mockShowObj.title.english}"`;
const testListString = `\n**| -** ${testShowString}`;
const testTrackString = `**Currently Tracking**` + `${testListString}`;
const testNoTrackString = `No shows are being tracked.`;

// Tests
describe('Tracker Suite', () => {
    // SETUP & TEARDOWN
    beforeEach(() => {
        tracker = new Tracker();
        tracker.mediaMap.set(mockShowObj.id, mockShowObj.title);
        ALProxy.mockReset();
    });
    
    // TESTS
    test('getMediaIds', () => {
        expect(tracker.getMediaIds()).toStrictEqual([mockShowObj.id]);
        tracker.mediaMap.clear();
        expect(tracker.getMediaIds()).toHaveLength(0);
    });

    test('hasMedia', () => {
        expect(tracker.hasMedia(mockShowObj.id)).toBeTruthy();
        tracker.mediaMap.clear();
        expect(tracker.hasMedia(mockShowObj.id)).toBeFalsy();
    });

    test('isValidMediaId', () => {
        expect(tracker.isValidMediaId('abc')).toBeFalsy();
        expect(tracker.isValidMediaId(0)).toBeFalsy();
        expect(tracker.isValidMediaId(-1)).toBeFalsy();
        expect(tracker.isValidMediaId(mockShowObj.id)).toBeTruthy();
    });

    test('getShowTitle', () => {
        expect(tracker.getShowTitle(mockShowObj.id)).toEqual(mockShowObj.title.english);
        let tracker2 = new Tracker();
        tracker2.mediaMap.set(mockShowObj.id, { romaji: mockShowObj.title.romaji });
        expect(tracker2.getShowTitle(mockShowObj.id)).toEqual(mockShowObj.title.romaji);
    });

    test('showToString', () => {
        let testString = `\`${mockShowObj.id}\`: "${mockShowObj.title.english}"`;
        expect(tracker.showToString(mockShowObj.id)).toEqual(testString);
    });

    test('listToString', () => {
        expect(tracker.listToString([mockShowObj.id])).toEqual(testListString);
        tracker.mediaMap.clear();
        expect(tracker.listToString([])).toEqual("");
    });

    test('printTrackingList', () => {
        expect(tracker.printTrackingList()).toEqual(testTrackString);
        tracker.mediaMap.clear();
        expect(tracker.printTrackingList()).toEqual(testNoTrackString);
    });

    test('printAiringList', () => {
        ALProxy.searchShowId.mockResolvedValueOnce(mockNAShowObj);
        ALProxy.searchShowId.mockResolvedValue(mockShowObj);
        tracker.mediaMap.set(mockNAShowObj.id, mockNAShowObj.title);

    });

    test('isAiringToday', async () => {
        ALProxy.searchShowId.mockImplementation(id => id === mockNAShowObj.id? mockNAShowObj : mockShowObj);
        tracker.mediaMap.set(mockNAShowObj.id, mockNAShowObj.title);
        expect(await tracker.isAiringToday(mockNAShowObj.id)).toBeFalsy();
        expect(await tracker.isAiringToday(mockShowObj.id)).toBeTruthy();
    });

    test('getAiringTodayList', async () => {
        ALProxy.searchShowId.mockImplementation(id => id === mockNAShowObj.id? mockNAShowObj : mockShowObj);
        tracker.mediaMap.set(mockNAShowObj.id, mockNAShowObj.title);
        expect(await tracker.getAiringTodayList()).toStrictEqual([mockShowObj.id]);
    });

    test('track', async () => {
        ALProxy.searchShowId.mockResolvedValueOnce(mockNAShowObj);
        ALProxy.searchShowId.mockResolvedValue(mockShowObj);
        tracker.mediaMap.clear();
        expect(await tracker.track(mockNAShowObj.id)).toEqual(`**Command Ignored**: Media Status \`${mockNAShowObj.status} != RELEASING\``);
        expect(await tracker.track(mockShowObj.id)).toEqual(`**Now Tracking (1/10):** ${testShowString}.`);
        const lenSpy = jest.spyOn(tracker, 'getNumIds').mockReturnValueOnce(100).mockReturnValueOnce(100);
        expect(await tracker.track(mockShowObj.id)).toEqual(`**Command Ignored**: **TRACK LIMIT REACHED (100/10).** Please untrack one or more to make room.`);
        expect(lenSpy).toHaveBeenCalledTimes(2);
        expect(await tracker.track(mockShowObj.id)).toEqual(`**Command Ignored**: Media already being tracked.`);
    });

    test('untrack', () => {
        expect(tracker.untrack(mockShowObj.id)).toEqual(`**Untracked (0/10):** ${testShowString}.`);
        expect(tracker.untrack('abc')).toEqual(`**Command Ignored**: Invalid Media ID. Please only enter an integer > 0`);
        expect(tracker.untrack(mockShowObj.id)).toEqual(`**Command Ignored**: Media not currently being tracked.`);
    });

    test('refreshMediaIds', async () => {
        ALProxy.searchShowId.mockImplementation(id => id === mockNAShowObj.id? mockNAShowObj : mockShowObj);
        tracker.mediaMap.set(mockNAShowObj.id, mockNAShowObj.title);
        expect(tracker.hasMedia(mockNAShowObj.id)).toBeTruthy();
        let responseStr = await tracker.refreshMediaIds();
        expect(tracker.hasMedia(mockNAShowObj.id)).toBeFalsy();
        expect(responseStr).toEqual(`**Refreshed Show List (No Longer Airing)**\n|- \`2\`: "Naruto"`);
    });
});

