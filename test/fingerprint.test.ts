import BrowserFingerprint from '../src/index';

describe('BrowserFingerprint', () => {
  it('should generate consistent fingerprint', async () => {
    const fp = new BrowserFingerprint({ persistent: false });
    const fingerprint1 = await fp.getFingerprint();
    const fingerprint2 = await fp.getFingerprint();
    expect(fingerprint1).toEqual(fingerprint2);
  });
});