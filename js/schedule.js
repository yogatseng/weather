class Schedule {
  constructor(name) {
    this.id = undefined
    this.name = name
    this.type = "interval"
    this.initial()
  }

  set id(id) {
    this._id = id
  }
  get id() {
    return this._id
  }

  set type(timeoutOrInterval) {
    if (['timeout', 'interval'].indexOf(timeoutOrInterval) !== -1) {
      this._type = timeoutOrInterval;
      return this
    } else {
      throw new Error("timeout or interval with type...")
    }
  }
  get type() {
    return this._type
  }
  set freqMillisecond(ms) {
    let isInit = this._freqMillisecond ? false : true
    if (isNaN(ms)) {
      throw new Error("請指定一個數值給 freqMillisecond !");
    }
    this._freqMillisecond = ms
    if (isInit) {
      if (this.isActive()) {
        stopSchedule()
        startSchedule()
      }
    }
  }
  get freqMillisecond() {
    return this._freqMillisecond
  }


  set action(cb) {
    this._action = cb
  }
  get action () {
    return this._action
  }
  
  isActive() {
    return !isNaN(this.id)
  }

  initial() {
    const schedule = this

    const hash = function () {
      schedule.stopSchedule()
      window.removeEventListener('hashchange', hash, false);
    }

    window.addEventListener('hashchange', hash, false);
  }

  start() {
    const schedule = this
    if (schedule.id) {
      return
    }
    if (isNaN(schedule.freqMillisecond)) {
      throw new Error("請明確指定一個值給 freqMillisecond !")
    }
    if (schedule.type === "timeout") {
      schedule.id = setTimeout(function timeoutAction() {
        try {
          schedule.action(function () {
            schedule.id = setTimeout(timeoutAction, schedule.freqMillisecond)
          })
        } catch (e) {
          console.warn('[Schedule ' + schedule.name + '] 葛了啦...')
          console.warn(e)
          schedule.id = setTimeout(timeoutAction, schedule.freqMillisecond)
        }
      }, 0)
    } else {
      try {
        schedule.action()
      } catch (e) {
        console.warn('[Schedule ' + schedule.name + '] 葛了啦...')
        console.warn(e)
      }
      schedule._id = setInterval(schedule.action, schedule.freqMillisecond)
    }
  }
  stop() {
    if (!this.id) {
      return
    }
    if (this.type === "timeout") {
      clearTimeout(this.id)
    } else {
      cleatInterval(this.id)
    }
    this.id = undefined
  }
}