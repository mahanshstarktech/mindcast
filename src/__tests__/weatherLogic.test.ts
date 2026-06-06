import { getMoodWeather } from '@/lib/weatherLogic';

describe('getMoodWeather', () => {
  it('maps 5 to sunny', () => {
    expect(getMoodWeather(5)).toBe('sunny');
  });

  it('maps 4 to partly-cloudy', () => {
    expect(getMoodWeather(4)).toBe('partly-cloudy');
  });

  it('maps 3 to rainy', () => {
    expect(getMoodWeather(3)).toBe('rainy');
  });

  it('maps 2 to stormy', () => {
    expect(getMoodWeather(2)).toBe('stormy');
  });

  it('maps 1 to hurricane', () => {
    expect(getMoodWeather(1)).toBe('hurricane');
  });
});
