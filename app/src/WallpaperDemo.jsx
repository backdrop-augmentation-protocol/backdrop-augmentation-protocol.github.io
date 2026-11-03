import { useEffect, useRef, useState } from 'react'

/**
 * Live recreation of the real BAP host-wallpaper demo (examples/host-wallpaper):
 * full-screen flower video + gradient shade, with the two real components
 * (calendar-widget top-right, time-widget bottom-left) composited on top.
 * Toggling a component off leaves the wallpaper running alone —
 * "Augmentation, not dependency".
 */

const WEEKDAYS = Array.from({ length: 7 }, (_, i) =>
  new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date(2024, 0, 1 + i))
)

function CalendarWidget({ now }) {
  const [expanded, setExpanded] = useState(true)
  const first = new Date(now.getFullYear(), now.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7 // Monday-first, same as the real widget
  const days = Array.from({ length: 42 }, (_, i) => {
    const day = new Date(now.getFullYear(), now.getMonth(), i - offset + 1)
    const classes = ['wp-day']
    if (day.getMonth() !== now.getMonth()) classes.push('outside')
    if (day.toDateString() === now.toDateString()) classes.push('today')
    return { key: i, date: day.getDate(), classes: classes.join(' ') }
  })
  return (
    <div className="wp-component wp-calendar" data-component-id="org.bap.examples.calendar-widget">
      <section className="wp-cal" aria-label="Calendar">
        <div className="wp-cal__topline">
          <div className="wp-cal__eyebrow">BAP CALENDAR</div>
          <button
            className="wp-cal__collapse"
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        <div className="wp-cal__heading">
          <span className="wp-cal__month">{new Intl.DateTimeFormat(undefined, { month: 'long' }).format(now)}</span>
          <span className="wp-cal__year">{now.getFullYear()}</span>
        </div>
        <div className="wp-cal__grid" hidden={!expanded}>
          {WEEKDAYS.map(d => <span key={d} className="wp-cal__weekday">{d}</span>)}
          {days.map(d => <span key={d.key} className={d.classes}>{d.date}</span>)}
        </div>
      </section>
    </div>
  )
}

function TimeWidget({ now }) {
  return (
    <div className="wp-component wp-time" data-component-id="org.bap.examples.time-widget">
      <div className="wp-time__card">
        <div className="wp-time__badge">BAP TIME WIDGET</div>
        <div className="wp-time__clock">
          {new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }).format(now)}
        </div>
        <div className="wp-time__date">{new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(now)}</div>
      </div>
    </div>
  )
}

export default function WallpaperDemo() {
  const [timeOn, setTimeOn] = useState(true)
  const [calOn, setCalOn] = useState(true)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(0.35)
  const [now, setNow] = useState(() => new Date())
  const videoRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = muted
    v.volume = volume
  }, [muted, volume])

  return (
    <div className="wp-demo">
      <div className="wp-stage" role="img" aria-label="BAP host wallpaper running with optional components">
        <video
          ref={videoRef}
          className="wp-video"
          src="./demo/flower.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="wp-shade" aria-hidden="true" />

        {calOn && <CalendarWidget now={now} />}
        {timeOn && <TimeWidget now={now} />}

        <div className="wp-controls">
          <button type="button" onClick={() => setMuted(m => !m)}>{muted ? 'Unmute' : 'Mute'}</button>
          <label>
            Volume{' '}
            <input
              type="range" min="0" max="1" step="0.05" value={volume}
              onChange={e => setVolume(Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="wp-panel">
        <div className="demo-group">
          <label className="demo-label">
            <span className="zh">增强组件（Components）</span>
            <span className="en">Components</span>
          </label>
          <div className="toggles">
            <button type="button" className={'tg' + (timeOn ? ' active' : '')} onClick={() => setTimeOn(v => !v)}>
              <span className="zh">时钟组件</span>
              <span className="en">Time widget</span>
            </button>
            <button type="button" className={'tg' + (calOn ? ' active' : '')} onClick={() => setCalOn(v => !v)}>
              <span className="zh">日历组件</span>
              <span className="en">Calendar widget</span>
            </button>
          </div>
        </div>
        <p className="demo-hint">
          <span className="zh">
            素材与布局取自官方示例壁纸（examples/host-wallpaper）。关闭所有组件，壁纸依旧独立运行——这正是「增强而非依赖」。
          </span>
          <span className="en">
            Assets and layout from the official demo wallpaper (examples/host-wallpaper). Turn off every component and the wallpaper still runs alone — that is "Augmentation, not dependency."
          </span>
        </p>
      </div>
    </div>
  )
}
