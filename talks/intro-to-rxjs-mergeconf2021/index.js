window.addEventListener("DOMContentLoaded", () => {
  const example1 = document.querySelector(".example-1")
  
  const bulbSwitch = example1.querySelector(".bulb-switch")
  const bulb = example1.querySelector(".bulb")
  
  bulbSwitch.addEventListener("click", () => {
    bulb.classList.toggle("is-active")
    bulbSwitch.innerHTML = bulb.classList.contains("is-active") ? "Выкл" : "Вкл"
  })
  
  const example2 = document.querySelector(".example-2")
  
  const bulbSwitchObservable = new BulbSwitchObservable(example2.querySelector(".bulb-switch"))
  const bulbObserver = new BulbObserver(example2.querySelector(".bulb"))
  
  bulbSwitchObservable.add(bulbObserver)
})

class Subject {
  observers = new Set()
  
  add(observer) {
    this.observers.add(observer)
  }
  
  remove(observer) {
    this.observers.delete(observer)
  }
  
  notify() {
    this.observers.forEach((observer) => observer.update())
  }
}

class Observer {
  update() {}
}

class BulbSwitchObservable extends Subject {
  bulbSwitch
  
  isActive = false
  
  constructor(bulbSwitch) {
    super()
    this.bulbSwitch = bulbSwitch
  }
  
  add(observer) {
    if (this.observers.size <= 0) {
      this.bulbSwitch.addEventListener("click", this.onClick)
    }
    
    super.add(observer)
  }
  
  remove(observer) {
    super.remove(observer)
  
    if (this.observers.size <= 0) {
      this.bulbSwitch.removeEventListener("click", this.onClick)
    }
  }
  
  onClick = () => {
    this.isActive = !this.isActive
    this.bulbSwitch.innerText = this.isActive ? "Выкл" : "Вкл"
    this.notify()
  }
}

class BulbObserver extends Observer {
  bulb
  
  constructor(bulb) {
    super()
    this.bulb = bulb
  }
  
  update() {
    this.bulb.classList.toggle("is-active")
  }
}
