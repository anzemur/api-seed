import moment from 'moment';

/**
 * Formats application uptime to format 'hh:mm:ss'.
 * @param uptime Application uptime.
 */
export function formatApplicationUptime(uptime: number) {
 function pad(num: number) {
    return (num < 10 ? '0' : '') + num;
  }
  const h = Math.floor(uptime / (60 * 60));
  const m = Math.floor(uptime % (60 * 60) / 60);
  const s = Math.floor(uptime % 60);

  return pad(h) + ':' + pad(m) + ':' + pad(s);
}

/**
 * Parses duration in ms to given format.
 * @param durationMs Duration in ms.
 * @param format Chosen format.
 */
export function parseDurationFromMs(durationMs: number, format?: string) {
  return moment.utc(durationMs).format(format || 'HH:mm:ss');
}
