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
        airingAt: Math.floor(Date.now() / 1000),
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
        tracker.trackedMediaIds.set(mockShowObj.id, mockShowObj.title);
        ALProxy.mockReset();
    });
    
    // TESTS
    test('getMediaIds', () => {
        expect(tracker.getMediaIds()).toStrictEqual([mockShowObj.id]);
        tracker.trackedMediaIds.clear();
        expect(tracker.getMediaIds()).toHaveLength(0);
    });

    test('hasMediaId', () => {
        expect(tracker.hasMediaId(mockShowObj.id)).toBeTruthy();
        tracker.trackedMediaIds.clear();
        expect(tracker.hasMediaId(mockShowObj.id)).toBeFalsy();
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
        tracker2.trackedMediaIds.set(mockShowObj.id, { romaji: mockShowObj.title.romaji });
        expect(tracker2.getShowTitle(mockShowObj.id)).toEqual(mockShowObj.title.romaji);
    });

    test('showToString', () => {
        let testString = `\`${mockShowObj.id}\`: "${mockShowObj.title.english}"`;
        expect(tracker.showToString(mockShowObj.id)).toEqual(testString);
    });

    test('listToString', () => {
        expect(tracker.listToString([mockShowObj.id])).toEqual(testListString);
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

    test('isAiringToday', async () => {
        tracker.trackedMediaIds.set(mockNAShowObj.id, mockNAShowObj.title.english);
        ALProxy.searchShowId.mockResolvedValueOnce(mockNAShowObj);
        ALProxy.searchShowId.mockResolvedValue(mockShowObj);
        expect(await tracker.isAiringToday(mockNAShowObj.id)).toBeFalsy();
        expect(await tracker.isAiringToday(mockShowObj.id)).toBeTruthy();
    });

    test('getAiringTodayList', async () => {
        tracker.trackedMediaIds.set(mockNAShowObj.id, mockNAShowObj.title.english);
        ALProxy.searchShowId.mockImplementation(id => id === mockNAShowObj.id? mockNAShowObj : mockShowObj);
        expect(await tracker.getAiringTodayList()).toStrictEqual([mockShowObj.id]);
    });

    test('track', async () => {
        tracker.trackedMediaIds.clear();
        ALProxy.searchShowId.mockResolvedValueOnce(mockNAShowObj);
        ALProxy.searchShowId.mockResolvedValue(mockShowObj);
        expect(await tracker.track(mockNAShowObj.id)).toEqual(`**Command Ignored**: \`${mockNAShowObj.id}\` - Media Status \`${mockNAShowObj.status} != RELEASING\``);
        expect(await tracker.track(mockShowObj.id)).toEqual(`**Now Tracking:** ${testShowString}`);
        const lenSpy = jest.spyOn(tracker, 'getNumIds').mockReturnValueOnce(100).mockReturnValueOnce(100);
        expect(await tracker.track(mockShowObj.id)).toEqual(`**Command Ignored**: \`${mockShowObj.id}\` - **TRACK LIMIT REACHED -** \`100/10 Active Shows.\``);
        expect(lenSpy).toHaveBeenCalledTimes(2);
        expect(await tracker.track(mockShowObj.id)).toEqual(`**Command Ignored**: \`${mockShowObj.id}\` - Media already being tracked.`);
    });

    test('untrack', () => {
        expect(tracker.untrack(mockShowObj.id)).toEqual(`**Untracked:** ${testShowString}`);
        expect(tracker.untrack('abc')).toEqual(`**Command Ignored**: \`abc\` - Invalid Media ID. Please only enter an integer > 0`);
        expect(tracker.untrack(mockShowObj.id)).toEqual(`**Command Ignored**: \`${mockShowObj.id}\` - Media not currently being tracked.`);
    });

    test('refreshMediaIds', () => {
        // TODO
    });
});

