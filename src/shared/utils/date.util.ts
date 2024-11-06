export class DateUtils {
  static getTimeInSecond(text: string): number {
    // format time: 2d1h30m => 2 days 1 hour 30 minutes
    const time = text.match(/(\d+[dhm])/g);
    if (!time) return 0;
    let duration = 0;
    time.forEach((t) => {
      const value = parseInt(t.replace(/[dhm]/g, ''));
      if (t.includes('d')) {
        duration += value * 24 * 60 * 60;
      } else if (t.includes('h')) {
        duration += value * 60 * 60;
      } else if (t.includes('m')) {
        duration += value * 60;
      }
    });
    return duration;
  }
}
