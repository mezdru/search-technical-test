/**
 * Simple timer to know the duration between two calls.
 */
class Timer {
  startTime;
  endTime;

  constructor() {}

  start() {
    this.startTime = new Date().getTime();
  }

  end() {
    this.endTime = new Date().getTime();
  }

  getDuration() {
    return this.endTime - this.startTime;
  }
}

module.exports = Timer;
