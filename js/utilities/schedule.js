class Schedule {
  constructor(name) {
    this.timer = undefined; // schedule主體
    this.type = "interval"; // schedule類型
    this.action = undefined; // schedule內的行為
    this.freqMillisecond = 1000; // schedule頻率

    this.bindHashEvent(); // 換頁時需要把schedule停掉
  }

  set type(timeoutOrInterval) {
    if (["timeout", "interval"].indexOf(timeoutOrInterval) !== -1) {
      this._type = timeoutOrInterval;
      return this;
    } else {
      throw new Error("timeout or interval with type...");
    }
  }
  get type() {
    return this._type;
  }

  set action(cb) {
    this._action = cb;
  }
  get action() {
    return this._action;
  }

  set freqMillisecond(ms) {
    if (isNaN(ms)) {
      throw new Error("請指定一個數值給 freqMillisecond !");
    }
    this._freqMillisecond = ms;
    if (this.timer !== undefined) {
      this.restart();
    }
  }
  get freqMillisecond() {
    return this._freqMillisecond;
  }

  bindHashEvent() {
    const schedule = this;

    const hash = function () {
      schedule.stop();
      window.removeEventListener("hashchange", hash, false);
    }

    window.addEventListener("hashchange", hash, false);
  }

  start() {
    const schedule = this;
    if (schedule.timer) {
      return;
    }

    if (isNaN(schedule.freqMillisecond)) {
      throw new Error("請明確指定一個值給 freqMillisecond !");
    }

    if (schedule.type === "timeout") {
      schedule.timer = setTimeout(function timeoutAction() {
        try {
          schedule.action(function () {
            schedule.timer = setTimeout(timeoutAction, schedule.freqMillisecond);
          });
        } catch (e) {
          console.warn("Schedule failed...", e);
          schedule.timer = setTimeout(timeoutAction, schedule.freqMillisecond);
        }
      }, 0);
    } else {
      try {
        schedule.action();
      } catch (e) {
        console.warn("Schedule failed...", e);
      }

      schedule.timer = setInterval(schedule.action, schedule.freqMillisecond);
    }
  }

  stop() {
    if (!this.timer) {
      return;
    }

    if (this.type === "timeout") {
      clearTimeout(this.timer);
    } else {
      clearInterval(this.timer);
    }

    this.timer = undefined;
  }

  restart() {
    this.stop();
    this.start();
  }
}