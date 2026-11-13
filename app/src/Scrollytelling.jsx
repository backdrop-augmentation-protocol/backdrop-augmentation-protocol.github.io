import { useEffect, useRef, useState } from 'react'

/**
 * Scrollytelling: 5 acts explaining why BAP differs from a monolithic
 * wallpaper with built-in widgets. This is an EXPLANATION layer (原理示意),
 * clearly marked — not a mock of the real product UI, and never presented
 * as a live recording (per planning doc §10).
 */

const ACTS = [
  {
    tag: { zh: '第一幕 · 独立完整的 Host', en: 'Act 1 · An independent Host' },
    title: { zh: '从一张完整壁纸开始', en: 'Start from one complete wallpaper' },
    body: {
      zh: 'Host 是一件独立作品：没有 Companion、没有任何组件，它在 Wallpaper Engine 中照常播放、照常交互。这是所有组合的起点。',
      en: 'A host is a standalone work: with no Companion and no components, it plays and interacts normally inside Wallpaper Engine. This is where every combination starts.',
    },
  },
  {
    tag: { zh: '第二幕 · 组件来自独立创作者', en: 'Act 2 · Components from independent creators' },
    title: { zh: '组件不是壁纸里的内置开关', en: 'Components are not built-in toggles' },
    body: {
      zh: '时钟、日历等组件由不同作者单独发布到 Steam Workshop，可以单独安装、更新，甚至作为独立壁纸运行。普通单体壁纸也能内置时钟——但那不是生态。',
      en: 'Clock, calendar, and other components are published separately on Steam Workshop by different authors — installed and updated on their own, or run as standalone wallpapers. A monolithic wallpaper can ship a built-in clock; that is not an ecosystem.',
    },
  },
  {
    tag: { zh: '第三幕 · BAPC 组合与配置', en: 'Act 3 · Compose & configure with BAPC' },
    title: { zh: '由用户决定怎样组合', en: 'The user decides how to compose' },
    body: {
      zh: '可选的 BAP Companion（BAPC）发现已安装的组件并管理预设；Host 在 Wallpaper Engine 中动态挂载组件。BAPC 负责管理与配置，WE 负责渲染——Companion 不是第二套壁纸引擎。',
      en: 'The optional BAP Companion (BAPC) discovers installed components and manages presets; the host mounts them dynamically inside Wallpaper Engine. BAPC manages, WE renders — Companion is not a second wallpaper engine.',
    },
  },
  {
    tag: { zh: '第四幕 · 动态启停与更换', en: 'Act 4 · Enable, disable, swap' },
    title: { zh: '组合不是一次性打包', en: 'Composing is not a one-time bundle' },
    body: {
      zh: '在 BAPC 中禁用或移除组件，桌面即时响应；背景与其余功能保持完整。Host 作者不需要为每一次组合变更重新发布作品。',
      en: 'Disable or remove a component in BAPC and the desktop reacts instantly, while the background and everything else stay intact. Host authors never re-release for each combination change.',
    },
  },
  {
    tag: { zh: '第五幕 · 持续演化的生态', en: 'Act 5 · An evolving ecosystem' },
    title: { zh: '今天的桌面，还能承接明天的新作品', en: "Today's desktop can host tomorrow's works" },
    body: {
      zh: '此后出现的新组件，只要与你的 Host 兼容（协议与能力匹配），就能用同样的流程加入已有桌面——不必等原作者逐个适配。组合始终以真实兼容条件为边界。',
      en: 'New components released later can join your existing desktop through the same flow — as long as they are compatible with your host (protocol and capabilities match), with no waiting on the original author. Composition is always bounded by real compatibility.',
    },
  },
]

function ClockWidget() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="wp-component wp-time">
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

function CalWidget({ dim }) {
  const now = new Date()
  const first = new Date(now.getFullYear(), now.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const days = Array.from({ length: 42 }, (_, i) => {
    const day = new Date(now.getFullYear(), now.getMonth(), i - offset + 1)
    return {
      key: i,
      d: day.getDate(),
      cls:
        'wp-day' +
        (day.getMonth() !== now.getMonth() ? ' outside' : '') +
        (day.toDateString() === now.toDateString() ? ' today' : ''),
    }
  })
  return (
    <div className={'wp-component wp-calendar' + (dim ? ' ss-dim' : '')}>
      <section className="wp-cal" aria-hidden="true">
        <div className="wp-cal__topline">
          <div className="wp-cal__eyebrow">BAP CALENDAR</div>
        </div>
        <div className="wp-cal__heading">
          <span className="wp-cal__month">{new Intl.DateTimeFormat(undefined, { month: 'long' }).format(now)}</span>
          <span className="wp-cal__year">{now.getFullYear()}</span>
        </div>
        <div className="wp-cal__grid">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} className="wp-cal__weekday">{d}</span>
          ))}
          {days.map((x) => (
            <span key={x.key} className={x.cls}>{x.d}</span>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function Scrollytelling() {
  const [act, setAct] = useState(0)
  const stepRefs = useRef([])

  useEffect(() => {
    const els = stepRefs.current.filter(Boolean)
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setAct(Number(e.target.dataset.act))
        })
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const mounted = act >= 2
  const calOff = act >= 3

  return (
    <div className="story">
      {/* sticky explanatory stage */}
      <div className="story__stage" role="img" aria-label="Illustrated desktop showing how BAP composes independently published components">
        <div className="demo-win ss-win">
          <div className="demo-win__bar">
            <span className="tl tl--r" aria-hidden="true" />
            <span className="tl tl--y" aria-hidden="true" />
            <span className="tl tl--g" aria-hidden="true" />
            <span className="demo-win__title">
              <span className="zh">桌面 · Wallpaper Engine</span>
              <span className="en">Desktop · Wallpaper Engine</span>
            </span>
            <span className="ss-badge">
              <span className="zh">原理示意</span>
              <span className="en">illustration</span>
            </span>
          </div>
          <div className="ss-desktop">
            <video className="wp-video ss-video" autoPlay loop muted playsInline preload="metadata" aria-hidden="true">
              <source src="./demo/flower.webm" type="video/webm" />
              <source src="./demo/flower.mp4" type="video/mp4" />
            </video>
            <div className="wp-shade" aria-hidden="true" />
            {mounted && <ClockWidget />}
            {mounted && <CalWidget dim={calOff} />}
          </div>
        </div>

        {/* workshop source cards (act 2+) */}
        <div className={'ss-card ss-card--t' + (act >= 1 ? ' on' : '')}>
          <span className="ss-card__src">Steam Workshop</span>
          <strong>BAP Time Widget</strong>
          <span className="ss-card__by"><span className="zh">独立作者 @aurora · 可单独订阅</span><span className="en">independent author @aurora · subscribable</span></span>
        </div>
        <div className={'ss-card ss-card--c' + (act >= 1 ? ' on' : '')}>
          <span className="ss-card__src">Steam Workshop</span>
          <strong>BAP Calendar Widget</strong>
          <span className="ss-card__by"><span className="zh">独立作者 @mika · 独立更新</span><span className="en">independent author @mika · updated separately</span></span>
        </div>
        <div className={'ss-card ss-card--n' + (act >= 4 ? ' on' : '')}>
          <span className="ss-card__src"><span className="zh">新作品 · 新作者</span><span className="en">new work · new author</span></span>
          <strong>BAP Audio Visualizer</strong>
          <span className="ss-card__by"><span className="zh">作者 @nova · 兼容你的 Host</span><span className="en">by @nova · compatible with your host</span></span>
        </div>

        {/* BAPC concept panel (act 3+) */}
        <div className={'ss-bapc' + (act >= 2 ? ' on' : '')}>
          <div className="ss-bapc__head">
            <strong>BAPC</strong>
            <span className="ss-bapc__mark"><span className="zh">概念示意</span><span className="en">concept UI</span></span>
          </div>
          <div className="ss-bapc__preset"><span className="zh">预设：我的桌面</span><span className="en">Preset: my desktop</span></div>
          <div className="ss-bapc__row">
            <span>BAP Time Widget</span>
            <span className={'ss-toggle' + (act >= 2 ? ' on' : '')} />
          </div>
          <div className="ss-bapc__row">
            <span className={calOff ? 'ss-bapc__off' : ''}>BAP Calendar Widget</span>
            <span className={'ss-toggle' + (act >= 2 && !calOff ? ' on' : '')} />
          </div>
          {act >= 4 && (
            <div className="ss-bapc__row ss-bapc__row--new">
              <span>BAP Audio Visualizer</span>
              <span className="ss-toggle on" />
            </div>
          )}
        </div>
      </div>

      {/* scrolling steps */}
      <div className="story__steps">
        {ACTS.map((a, i) => (
          <div
            key={i}
            data-act={i}
            ref={(el) => (stepRefs.current[i] = el)}
            className={'story-step' + (i === act ? ' active' : '')}
          >
            <p className="story-step__tag">
              <span className="zh">{a.tag.zh}</span>
              <span className="en">{a.tag.en}</span>
            </p>
            <h3>
              <span className="zh">{a.title.zh}</span>
              <span className="en">{a.title.en}</span>
            </h3>
            <p className="story-step__body">
              <span className="zh">{a.body.zh}</span>
              <span className="en">{a.body.en}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
