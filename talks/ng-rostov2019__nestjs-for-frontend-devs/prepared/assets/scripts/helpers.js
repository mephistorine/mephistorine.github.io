const { interval, Subject } = rxjs
const { ajax } = rxjs.ajax
const { switchMap, tap, map, take, takeUntil, startWith } = rxjs.operators

const slidesFuncs = {
  'about-nestjs': (element) => aboutNestjsHandler(element)
}

export function main(event) {

  const elements = elementsInit();
}

function elementsInit() {
  const slides = document.querySelectorAll('.slide');
  const elements = {};

  for (const slide of slides) {
    if (slide.classList.contains('to-js')) {
      elements[ slide.id ] = {
        element: slide,
        handler: slidesFuncs[ slide.id ](slide)
      }
    }
  }

  return elements
}

// было к началу подготовки к докладу 18262
function aboutNestjsHandler(element) {
  const containerForStars = element.querySelector('.github-stars .value')
  const netsjsApi = 'https://api.github.com/repos/nestjs/nest'

  ajax(netsjsApi).pipe(
    take(1),
    startWith({ response: { 'watchers_count': 18279 } }),
    map((ajax) => ajax.response[ 'watchers_count' ]),
    tap((starCount) => containerForStars.innerText = starCount)
  ).subscribe()

  interval(10 * 1000).pipe(
    switchMap(() => ajax(netsjsApi).pipe(
      map((ajax) => ajax.response[ 'watchers_count' ]),
      tap((starCount) => containerForStars.innerText = starCount)
    ))
  ).subscribe()
}

