const subject = new Subject()

const observable = from(...).pipe(
  takeUntil(subject)
)

const sub1 = observable.subscribe()
const sub2 = observable.subscribe()
const sub3 = observable.subscribe()

onDestroy(() => {
  subject.next()
  subject.complete()
})
