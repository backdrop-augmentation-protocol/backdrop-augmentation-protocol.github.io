import { useEffect, useRef, useState } from 'react'

const HOST_LABELS = {
  aurora: { zh: '极光', en: 'Aurora' },
  nebula: { zh: '星云', en: 'Nebula' },
  mesh:   { zh: '网格', en: 'Mesh' },
}
const COMP_LABELS = {
  clock:     { zh: '时钟', en: 'Clock' },
  audio:     { zh: '音频', en: 'Audio' },
  particles: { zh: '粒子', en: 'Particles' },
  weather:   { zh: '天气', en: 'Weather' },
  frame:     { zh: '边框', en: 'Frame' },
}
const HOSTS = Object.keys(HOST_LABELS)
const COMPS = Object.keys(COMP_LABELS)

export default function DemoCanvas() {
  const canvasRef = useRef(null)
  const [host, setHost] = useState('aurora')
  const [comps, setComps] = useState({
    clock: true, audio: true, particles: true, weather: false, frame: false,
  })
  // live mirror for the rAF loop (avoids restarting the animation each render)
  const stateRef = useRef({ host, comps })
  stateRef.current = { host, comps }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0, DPR = 1, stars = [], nodes = []
    let raf = 0, cancelled = false

    const roundRect = (x, y, w, h, r) => {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + h, r)
      ctx.arcTo(x + w, y + h, x, y + h, r)
      ctx.arcTo(x, y + h, x, y, r)
      ctx.arcTo(x, y, x + w, y, r)
      ctx.closePath()
    }
    const glow = (x, y, r, color) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, color)
      g.addColorStop(1, 'transparent')
      ctx.fillStyle = g
      ctx.fillRect(x - r, y - r, r * 2, r * 2)
    }
    const initField = () => {
      const count = Math.round((W * H) / 9000)
      stars = []
      for (let i = 0; i < Math.min(count, 180); i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
          r: Math.random() * 1.6 + 0.4, tw: Math.random() * 2 + 0.5, ph: Math.random() * 6,
        })
      }
      nodes = []
      const n = Math.max(22, Math.min(46, Math.round((W * H) / 26000)))
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        })
      }
    }
    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth || canvas.parentElement.clientWidth
      H = canvas.clientHeight || canvas.parentElement.clientHeight
      canvas.width = Math.max(1, Math.floor(W * DPR))
      canvas.height = Math.max(1, Math.floor(H * DPR))
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      initField()
    }

    /* ---------- HOST wallpapers (run independently) ---------- */
    const drawAurora = (t) => {
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, '#06122e'); g.addColorStop(1, '#0a1430')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
      const cols = ['rgba(43,212,255,', 'rgba(157,123,255,', 'rgba(63,182,255,']
      for (let i = 0; i < 3; i++) {
        const baseY = H * (0.32 + i * 0.2)
        const amp = 34 + i * 16
        ctx.beginPath()
        for (let x = 0; x <= W; x += 12) {
          const y = baseY
            + Math.sin(x * 0.006 + t * 0.6 + i) * amp
            + Math.sin(x * 0.013 - t * 0.4 + i * 2) * amp * 0.4
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath()
        const grad = ctx.createLinearGradient(0, baseY - amp, 0, H)
        grad.addColorStop(0, cols[i] + '0)')
        grad.addColorStop(0.4, cols[i] + '0.22)')
        grad.addColorStop(1, cols[i] + '0.02)')
        ctx.fillStyle = grad; ctx.fill()
      }
    }
    const drawNebula = (t) => {
      ctx.fillStyle = '#05081c'; ctx.fillRect(0, 0, W, H)
      glow(W * 0.3, H * 0.34, 280, 'rgba(157,123,255,0.20)')
      glow(W * 0.74, H * 0.62, 240, 'rgba(43,212,255,0.16)')
      for (const s of stars) {
        let x = (s.x + t * s.vx) % W; if (x < 0) x += W
        let y = (s.y + t * s.vy) % H; if (y < 0) y += H
        const a = 0.35 + 0.65 * Math.abs(Math.sin(t * s.tw + s.ph))
        ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(2) + ')'
        ctx.fillRect(x, y, s.r, s.r)
      }
    }
    const drawMesh = (t) => {
      ctx.fillStyle = '#061026'; ctx.fillRect(0, 0, W, H)
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 150) {
            ctx.strokeStyle = 'rgba(43,212,255,' + (0.2 * (1 - d / 150)).toFixed(3) + ')'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(157,123,255,0.9)'
        ctx.beginPath(); ctx.arc(n.x, n.y, 2.2, 0, 7); ctx.fill()
      }
    }

    /* ---------- COMPONENTS (optional augmentations) ---------- */
    const compClock = () => {
      const now = new Date()
      const txt = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(v => String(v).padStart(2, '0')).join(':')
      ctx.save()
      ctx.font = '700 26px "Segoe UI", Consolas, monospace'
      const pad = 14, w = ctx.measureText(txt).width + pad * 2, x = W - w - 22, y = 22
      roundRect(x, y, w, 46, 12)
      ctx.fillStyle = 'rgba(6,11,26,0.55)'; ctx.fill()
      ctx.strokeStyle = 'rgba(43,212,255,0.5)'; ctx.lineWidth = 1; ctx.stroke()
      ctx.fillStyle = '#eaf2ff'; ctx.textBaseline = 'middle'
      ctx.fillText(txt, x + pad, y + 24)
      ctx.restore()
    }
    const compAudio = (t) => {
      const bars = 28, bw = 6, gap = 4, totalW = bars * (bw + gap)
      const x0 = W / 2 - totalW / 2, y0 = H - 42
      for (let i = 0; i < bars; i++) {
        const h = 8 + Math.abs(Math.sin(t * 3 + i * 0.5)) * 34 * (0.5 + 0.5 * Math.sin(i * 0.3 + t))
        const x = x0 + i * (bw + gap)
        const grad = ctx.createLinearGradient(0, y0 - h, 0, y0)
        grad.addColorStop(0, '#2bd4ff'); grad.addColorStop(1, '#9d7bff')
        ctx.fillStyle = grad; roundRect(x, y0 - h, bw, h, 3); ctx.fill()
      }
    }
    const compParticles = (t) => {
      for (let i = 0; i < 46; i++) {
        const x = (Math.sin(i * 12.9 + t * 0.3) * 0.5 + 0.5) * W
        const y = ((i * 73.3 + t * 22 * (1 + (i % 3))) % H + H) % H
        const a = Math.max(0, 0.3 + 0.4 * Math.sin(t + i))
        ctx.fillStyle = 'rgba(157,123,255,' + (a * 0.6).toFixed(3) + ')'
        ctx.beginPath(); ctx.arc(x, y, 1.4, 0, 7); ctx.fill()
      }
    }
    const compWeather = () => {
      const x = 22, y = H - 80
      roundRect(x, y, 158, 58, 12)
      ctx.fillStyle = 'rgba(6,11,26,0.55)'; ctx.fill()
      ctx.strokeStyle = 'rgba(92,224,196,0.5)'; ctx.lineWidth = 1; ctx.stroke()
      ctx.fillStyle = '#ffd28a'
      ctx.beginPath(); ctx.arc(x + 30, y + 29, 12, 0, 7); ctx.fill()
      ctx.fillStyle = '#eaf2ff'; ctx.font = '700 22px "Segoe UI"'; ctx.textBaseline = 'middle'
      ctx.fillText('21°C', x + 52, y + 29)
      ctx.fillStyle = '#9fb0d0'; ctx.font = '600 12px "Segoe UI"'
      ctx.fillText('Clear · BAP City', x + 14, y + 48)
    }
    const compFrame = () => {
      const m = 18
      ctx.strokeStyle = 'rgba(157,123,255,0.35)'; ctx.lineWidth = 2
      roundRect(m, m, W - 2 * m, H - 2 * m, 18); ctx.stroke()
      ctx.strokeStyle = 'rgba(43,212,255,0.7)'; ctx.lineWidth = 2
      const c = 22
      [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, sx, sy]) => {
        ctx.beginPath(); ctx.moveTo(x, y + sy * c); ctx.lineTo(x, y); ctx.lineTo(x + sx * c, y); ctx.stroke()
      })
    }

    const loop = () => {
      if (cancelled) return
      const t = performance.now() / 1000
      const s = stateRef.current
      if (s.host === 'aurora') drawAurora(t)
      else if (s.host === 'nebula') drawNebula(t)
      else drawMesh(t)
      if (s.comps.clock) compClock()
      if (s.comps.audio) compAudio(t)
      if (s.comps.particles) compParticles(t)
      if (s.comps.weather) compWeather()
      if (s.comps.frame) compFrame()
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    resize()
    loop()
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <aside className="demo-panel" id="demo" aria-label="live BAP demo">
        <div className="demo-panel__head">
          <span className="dot" />
          <span className="zh">实时演示：本站即一个 BAP Host</span>
          <span className="en">Live demo: this site is a BAP Host</span>
        </div>
        <div className="demo-panel__body">
          <div className="demo-group">
            <label className="demo-label">
              <span className="zh">宿主壁纸（Host）</span>
              <span className="en">Host wallpaper</span>
            </label>
            <div className="seg">
              {HOSTS.map(h => (
                <button key={h} className={host === h ? 'active' : ''} onClick={() => setHost(h)}>
                  <span className="zh">{HOST_LABELS[h].zh}</span>
                  <span className="en">{HOST_LABELS[h].en}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="demo-group">
            <label className="demo-label">
              <span className="zh">增强组件（Components）</span>
              <span className="en">Components</span>
            </label>
            <div className="toggles">
              {COMPS.map(c => (
                <button
                  key={c}
                  className={'tg' + (comps[c] ? ' active' : '')}
                  onClick={() => setComps(prev => ({ ...prev, [c]: !prev[c] }))}
                >
                  <span className="zh">{COMP_LABELS[c].zh}</span>
                  <span className="en">{COMP_LABELS[c].en}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="demo-hint">
            <span className="zh">关闭所有组件，壁纸依旧独立运行——这正是「增强而非依赖」。</span>
            <span className="en">Turn off every component and the wallpaper still runs alone — that is "Augmentation, not dependency."</span>
          </p>
        </div>
      </aside>
    </>
  )
}
