
export class MocksClass {
    constructor(
    public sessionId: string,
    public userIp: string,
    public visitDate: string,
    public device: string,
    public browser: string,
    public location: string,
    public reffer: string) {

    }
    
}

const mock1 = new MocksClass(
    '_session1',
    '11.111.11.0',
    '12/12/12',
    'desktop',
    'chrome',
    'Poland',
    'none'
);

const mock2 = new MocksClass(
    '_session2',
    '11.111.11.0',
    '11/12/12',
    'desktop',
    'Firefox',
    'Poland',
    'none'
);

const mock3 = new MocksClass(
    '_session3',
    '11.111.11.0',
    '6/2/12',
    'tablet',
    'chrome',
    'Poland',
    'facebook'
);

const mock4 = new MocksClass(
    '_session4',
    '11.111.11.0',
    '12/12/12',
    'tablet',
    'safari',
    'Poland',
    'none'
);

const mock5 = new MocksClass(
    '_session5',
    '11.111.11.1',
    '9/9/09',
    'desktop',
    'explorer',
    'Spain',
    'none'
);

const mock6 = new MocksClass(
    '_session6',
    '11.111.11.1',
    '12/12/12',
    'phone',
    'chrome',
    'Spain',
    'none'
);

const mock7 = new MocksClass(
    '_session7',
    '11.111.11.1',
    '11/10/09',
    'desktop',
    'explorer',
    'Spain',
    'google'
);

const mock8 = new MocksClass(
    '_session8',
    '11.111.11.2',
    '22/12/19',
    'phone',
    'safari',
    'Poland',
    'none'
);

const mock9 = new MocksClass(
    '_session9',
    '11.111.11.2',
    '12/12/12',
    'desktop',
    'chrome',
    'Poland',
    'none'
);

const mock10 = new MocksClass(
    '_session10',
    '11.111.11.3',
    '12/12/12',
    'desktop',
    'chrome',
    'Russia',
    'facebook'
);

export const mockedUserId = 'temporaryId';

export const mocksArr: MocksClass[] = [mock1, mock2, mock3, mock4, mock5, mock6, mock7, mock8, mock9, mock10];




