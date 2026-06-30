interface Props {
  slides: [HTMLElement | string, string][]
  duration?: number
  animEnd?: () => void
}

const locks = new WeakMap<HTMLElement, true>()

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function measureWidth(text: string, font: string): number {
  const s = document.createElement('span')
  s.style.cssText = 'position:fixed;visibility:hidden;white-space:nowrap;pointer-events:none;top:0;left:0'
  s.style.font = font
  s.textContent = text
  document.body.append(s)
  const w = s.offsetWidth
  s.remove()
  return w
}

export function SlidingText({ slides, duration = 300, animEnd }: Props) {
  if (!slides?.length) throw new Error('No se proporcionaron slides')

  let done = 0

  for (let i = 0; i < slides.length; i++) {
    const [selector, text] = slides[i]
    const next = String(text)
    const elem = selector instanceof HTMLElement ? selector : document.querySelector<HTMLElement>(selector)
    if (!elem) { console.error(`Elemento [${i}] no encontrado`); continue }
    if (locks.has(elem)) continue
    locks.set(elem, true)

    const old = elem.textContent ?? ''
    if (!old) { console.error(`Slide [${i}] vacío`); locks.delete(elem); continue }

    const font = getComputedStyle(elem).font
    const oldW = measureWidth(old, font)
    const newW = measureWidth(next, font)
    const maxW = Math.max(oldW, newW)

    const prevInlineW = elem.style.width
    const prevOverflow = elem.style.overflow
    const origWidth = elem.offsetWidth

    elem.style.boxSizing = 'border-box'
    elem.style.width = `${origWidth}px`
    elem.style.overflow = 'hidden'

    const c = document.createElement('div')
    c.className = 'sliding-text'
    c.style.setProperty('--time', `${duration}ms`)
    c.style.width = `${maxW}px`
    c.innerHTML = `<span class="sliding-text-out">${esc(old)}</span><span class="sliding-text-in">${esc(next)}</span>`

    elem.innerHTML = c.outerHTML

    if (maxW !== origWidth) {
      elem.style.transition = `width ${duration * 0.4}ms ease`
      elem.style.width = `${maxW}px`
    }

    elem.addEventListener('animationend', () => {
      elem.style.transition = `width ${duration}ms ease`
      elem.innerHTML = esc(next)
      elem.style.width = `${newW}px`

      const cleanup = () => {
        elem.style.transition = ''
        elem.style.width = prevInlineW
        elem.style.overflow = prevOverflow
        elem.style.boxSizing = ''
        locks.delete(elem)
        done++
        if (done === slides.length) animEnd?.()
      }

      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'width') return
        elem.removeEventListener('transitionend', onEnd)
        cleanup()
      }
      elem.addEventListener('transitionend', onEnd)

      if (newW === maxW) cleanup()
      else setTimeout(cleanup, duration + 100)
    }, { once: true })
  }
}
