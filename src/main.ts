import '../src/lib/style.css'
import { SlidingText } from '../src/lib/sliding-text.ts'
import mainSource from '../src/lib/sliding-text.ts?raw'
import cssSource from '../src/lib/style.css?raw'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('javascript', javascript)

// ─── Global speed state ────────────────────────────────────────

let globalSpeed = 300

// ─── Nav scroll effect ─────────────────────────────────────────

{
  const nav = document.getElementById('nav')
  if (nav) {
    const onScroll = () => nav.classList.toggle('nav-scrolled', window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }
}

// ─── Hero auto-cycle ───────────────────────────────────────────

{
  const el = document.querySelector<HTMLElement>('.hero-target')
  const phrases = ['tu texto', 'cualquier elemento', 'suavemente', 'al instante']
  let idx = 0
  if (el) {
    function next() {
      idx = (idx + 1) % phrases.length
      SlidingText({
        slides: [[el!, phrases[idx]]],
        duration: globalSpeed,
        animEnd: () => setTimeout(next, 2000),
      })
    }
    setTimeout(next, 1500)
  }
}

// ─── Click demo ────────────────────────────────────────────────

{
  const card = document.querySelector('.card-click')
  const a = document.querySelector<HTMLElement>('.click-a')
  const b = document.querySelector<HTMLElement>('.click-b')
  const c = document.querySelector<HTMLElement>('.click-c')
  const textsA = ['Primer texto', 'Texto inicial', 'Primero']
  const textsB = ['Segundo texto', 'Texto medio', 'Segundo']
  const textsC = ['Tercer texto', 'Texto final', 'Tercero']
  let idx = 0

  card?.addEventListener('click', () => {
    idx = (idx + 1) % textsA.length
    const slides: [HTMLElement | string, string][] = []
    if (a) slides.push([a, textsA[idx]])
    if (b) slides.push([b, textsB[idx]])
    if (c) slides.push([c, textsC[idx]])
    if (slides.length) SlidingText({ slides, duration: globalSpeed })
  })
}

// ─── Auto cycle demo ───────────────────────────────────────────

{
  const els = [
    document.querySelector<HTMLElement>('.cycle-a'),
    document.querySelector<HTMLElement>('.cycle-b'),
    document.querySelector<HTMLElement>('.cycle-c'),
  ].filter(Boolean) as HTMLElement[]

  const cycles = [
    ['Primero', 'Segundo', 'Tercero'],
    ['Alpha', 'Beta', 'Gamma'],
    ['Rojo', 'Verde', 'Azul'],
  ]
  let idx = 0

  if (els.length === 3) {
    function next() {
      idx = (idx + 1) % cycles[0].length
      SlidingText({
        slides: [
          [els[0], cycles[0][idx]],
          [els[1], cycles[1][idx]],
          [els[2], cycles[2][idx]],
        ],
        duration: globalSpeed,
        animEnd: () => setTimeout(next, 2000),
      })
    }
    setTimeout(next, 2000)
  }
}

// ─── Speed control ─────────────────────────────────────────────

{
  const slider = document.querySelector<HTMLInputElement>('.speed-slider')
  const valueEl = document.querySelector<HTMLElement>('.speed-value')
  const a = document.querySelector<HTMLElement>('.speed-a')
  const b = document.querySelector<HTMLElement>('.speed-b')
  const c = document.querySelector<HTMLElement>('.speed-c')
  let timer = 0

  slider?.addEventListener('input', () => {
    const ms = Number(slider.value)
    globalSpeed = ms
    if (valueEl) valueEl.textContent = `${ms} ms`
    clearTimeout(timer)
    timer = setTimeout(() => {
      const slides: [HTMLElement | string, string][] = []
      if (a) slides.push([a, `${ms} ms`])
      if (b) slides.push([b, `${ms} ms`])
      if (c) slides.push([c, `${ms} ms`])
      if (slides.length) SlidingText({ slides, duration: ms })
    }, 300)
  })
}

// ─── Usage section ─────────────────────────────────────────────

{
  const TS_CODE = [
    `import { SlidingText } from './sliding-text';`,
    `import './style.css';`,
    ``,
    `SlidingText({`,
    `  slides: [`,
    `    ['.mi-elemento', 'Texto nuevo'],`,
    `    [elementoRef, 'Otro texto'],`,
    `  ],`,
    `  duration: 400, // opcional, por defecto 300ms`,
    `  animEnd: () => {`,
    `    console.log('Animación completada');`,
    `  },`,
    `});`,
  ].join('\n')

  const JS_CODE = [
    `import { SlidingText } from './sliding-text.js';`,
    `import './style.css';`,
    ``,
    `SlidingText({`,
    `  slides: [`,
    `    ['.mi-elemento', 'Texto nuevo'],`,
    `    [elementoRef, 'Otro texto'],`,
    `  ],`,
    `  duration: 400, // opcional, por defecto 300ms`,
    `  animEnd: () => {`,
    `    console.log('Animación completada');`,
    `  },`,
    `});`,
  ].join('\n')

  const codeEl = document.getElementById('usage-code')
  const btns = document.querySelectorAll<HTMLButtonElement>('.usage-tab-btn')
  const copyBtn = document.getElementById('usage-copy-btn')

  function lang(l: string) {
    btns.forEach((b) => {
      const on = b.dataset.tab === l
      b.classList.toggle('text-indigo-300', on)
      b.classList.toggle('border-indigo-400', on)
      b.classList.toggle('text-zinc-500', !on)
      b.classList.toggle('border-transparent', !on)
    })
    const code = l === 'js' ? JS_CODE : TS_CODE
    if (codeEl) {
      codeEl.innerHTML = hljs.highlight(code, { language: 'typescript' }).value
      codeEl.dataset.lang = l
    }
  }

  btns.forEach((b) => b.addEventListener('click', () => { const t = b.dataset.tab; if (t) lang(t) }))
  lang('ts')

  copyBtn?.addEventListener('click', async () => {
    const l = codeEl?.dataset.lang ?? 'ts'
    const code = l === 'js' ? JS_CODE : TS_CODE
    try {
      await navigator.clipboard.writeText(code)
      copyBtn.textContent = '¡Copiado!'
      copyBtn.classList.add('text-emerald-400')
      setTimeout(() => {
        copyBtn.textContent = 'Copiar'
        copyBtn.classList.remove('text-emerald-400')
      }, 1500)
    } catch {
      copyBtn.textContent = 'Error'
      setTimeout(() => { copyBtn.textContent = 'Copiar' }, 1500)
    }
  })
}

// ─── Source code viewer ────────────────────────────────────────

;(async () => {
  type FileKey = 'main' | 'css'

  const FILES: Record<FileKey, { src: string; name: string; lang: string }> = {
    main: { src: mainSource, name: 'sliding-text.ts', lang: 'typescript' },
    css: { src: cssSource, name: 'style.css', lang: 'css' },
  }

  let curFile: FileKey = 'main'
  let curLang: 'ts' | 'js' = 'ts'
  let jsCache: string | null = null

  const codeEl = document.getElementById('source-code')
  const btns = document.querySelectorAll<HTMLButtonElement>('.file-tab-btn')
  const langBtns = document.querySelectorAll<HTMLButtonElement>('.lang-btn')
  const langToggle = document.getElementById('lang-toggle')
  const copyBtn = document.getElementById('source-copy-btn')
  const downloadBtn = document.getElementById('download-btn')

  function render() {
    if (!codeEl) return
    const f = FILES[curFile]
    const src = curLang === 'js' && jsCache ? jsCache : f.src
    const lang = curLang === 'js' ? 'javascript' : f.lang
    codeEl.innerHTML = hljs.highlight(src, { language: lang }).value
  }

  function showFile(file: FileKey) {
    curFile = file
    btns.forEach((b) => {
      const on = b.dataset.file === file
      b.classList.toggle('text-indigo-300', on)
      b.classList.toggle('border-indigo-400', on)
      b.classList.toggle('text-zinc-500', !on)
      b.classList.toggle('border-transparent', !on)
    })

    // Hide lang toggle when viewing CSS
    if (langToggle) {
      langToggle.classList.toggle('hidden', file !== 'main')
    }

    if (file !== 'main') curLang = 'ts'
    render()
  }

  async function setLang(l: 'ts' | 'js') {
    curLang = l
    langBtns.forEach((b) => {
      const on = b.dataset.lang === l
      b.classList.toggle('bg-indigo-600', on)
      b.classList.toggle('text-white', on)
      b.classList.toggle('text-zinc-400', !on)
      b.classList.toggle('hover:text-zinc-200', !on)
    })

    if (l === 'js' && !jsCache) {
      try {
        // Lazy-load TypeScript compiler from CDN
        if (!(window as any).ts) {
          codeEl!.textContent = 'Compilando…'
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement('script')
            s.src = 'https://cdn.jsdelivr.net/npm/typescript@5.7.2/lib/typescript.min.js'
            s.onload = () => resolve()
            s.onerror = () => reject()
            document.head.appendChild(s)
          })
        }
        const result = (window as any).ts.transpileModule(FILES.main.src, {
          module: (window as any).ts.ModuleKind.ESNext,
          target: (window as any).ts.ScriptTarget.ES2020,
        })
        jsCache = result.outputText
      } catch {
        codeEl!.textContent = 'Error al compilar a JavaScript'
        return
      }
    }
    render()
  }

  btns.forEach((b) =>
    b.addEventListener('click', () => {
      const f = b.dataset.file as FileKey | undefined
      if (f) showFile(f)
    })
  )

  langBtns.forEach((b) =>
    b.addEventListener('click', () => {
      const l = b.dataset.lang as 'ts' | 'js' | undefined
      if (l) setLang(l)
    })
  )

  showFile('main')

  // Copy
  copyBtn?.addEventListener('click', async () => {
    const f = FILES[curFile]
    const src = curLang === 'js' && jsCache ? jsCache : f.src
    try {
      await navigator.clipboard.writeText(src)
      copyBtn.textContent = '¡Copiado!'
      copyBtn.classList.add('text-emerald-400')
      setTimeout(() => {
        copyBtn.textContent = 'Copiar'
        copyBtn.classList.remove('text-emerald-400')
      }, 1500)
    } catch {
      copyBtn.textContent = 'Error'
      setTimeout(() => { copyBtn.textContent = 'Copiar' }, 1500)
    }
  })

  // Download
  downloadBtn?.addEventListener('click', () => {
    const f = FILES[curFile]
    const src = curLang === 'js' && jsCache ? jsCache : f.src
    const name = curLang === 'js' ? 'sliding-text.js' : f.name
    const blob = new Blob([src], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  })
})()
