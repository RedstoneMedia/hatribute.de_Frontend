import { Base64ImageSafePipe } from './base64-image-safe.pipe';

describe('Base64ImageSafePipe', () => {
  it('create an instance', () => {
    const pipe = new Base64ImageSafePipe();
    expect(pipe).toBeTruthy();
  });
});
