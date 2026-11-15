import { useEffect, useRef, useState } from 'react'

const acts = [
  { tag: ['01 / THE CANVAS', '01 / 桌面组合'], title: ['A world of its own, ready to become yours.', '让动态壁纸，成为你的桌面风景。'], body: ['Aurora sets the scene. Add independent works when you want more; the wallpaper always runs on its own.', 'Aurora 自成流动风景；想要更多，再加入独立组件。动态壁纸始终完整运行。'] },
  { tag: ['02 / THE WORKS', '02 / 独立作品'], title: ['Made separately. Ready to meet.', '独立创作的作品，自由加入组合。'], body: ['Clock, Calendar and Focus are independent works. BAP Companion helps you bring them together in a preset.', 'Clock、Calendar 与 Focus 各自独立创作，再通过 BAP Companion 自由加入桌面组合。'] },
  { tag: ['03 / YOUR DESKTOP', '03 / 你的桌面'], title: ['Choose what belongs in your scene.', '由你决定，哪些作品加入桌面。'], body: ['BAP Companion organizes installed components, instances and presets. Your host remains the canvas.', 'BAP Companion 管理已安装组件、实例与预设；动态壁纸仍是桌面的画布。'] },
  { tag: ['04 / IN YOUR HANDS', '04 / 随心调整'], title: ['Arrange it. Tune it. Make it yours.', '重新摆放、细致调整，成为你的桌面。'], body: ['Change a component’s position, scale or opacity, then see your composition settle into place.', '调整组件位置、大小与透明度，让桌面组合逐渐成为你喜欢的样子。'] },
  { tag: ['05 / WHAT COMES NEXT', '05 / 持续生长'], title: ['A desktop with room for what’s next.', '为下一件新作品，留好位置。'], body: ['As compatible works arrive, your desktop can grow with them—one independent creation at a time.', '当更多兼容作品到来，你的桌面也能继续扩展，一件独立创作接一件。'] },
]

function LiveClock({ zh }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer) }, [])
  const time = new Intl.DateTimeFormat(zh ? 'zh-CN' : 'en-US', { hour:'2-digit', minute:'2-digit', hour12:false }).format(now)
  const date = new Intl.DateTimeFormat(zh ? 'zh-CN' : 'en-US', { weekday:'short', month:'short', day:'numeric' }).format(now)
  return <div className="live-clock"><div className="live-clock__face"><span className="live-dot"/>{zh ? '极光 / 本地时间' : 'AURORA / LOCAL TIME'}</div><div className="live-clock__time">{time}<i style={{'--hour':`${(now.getHours()%12+now.getMinutes()/60)*30}deg`,'--minute':`${(now.getMinutes()+now.getSeconds()/60)*6}deg`}}><b/><em/></i></div><div className="live-clock__date">{date}</div><div className="live-clock__rule"/><div className="live-clock__foot">{zh ? '本地时间' : 'LOCAL TIME'}<span>◆</span></div></div>
}

function LiveCalendar({ zh }) {
  const [shown, setShown] = useState(() => new Date())
  const now = new Date()
  const first = new Date(shown.getFullYear(), shown.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const days = Array.from({length:42},(_,index)=>new Date(shown.getFullYear(),shown.getMonth(),index-offset+1))
  const month = new Intl.DateTimeFormat(zh?'zh-CN':'en-US',{month:'short',year:'numeric'}).format(shown)
  const week = Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(zh?'zh-CN':'en-US',{weekday:'short'}).format(new Date(2024,0,8+i)))
  const shift = amount => setShown(value=>new Date(value.getFullYear(),value.getMonth()+amount,1))
  return <div className="live-calendar"><div className="live-calendar__top"><b>{zh?'极光 / 日历':'AURORA / CALENDAR'}</b><button onClick={()=>setShown(new Date(now.getFullYear(),now.getMonth(),1))}>{new Intl.DateTimeFormat(zh?'zh-CN':'en-US',{month:'short',day:'numeric'}).format(now)}</button></div><div className="live-calendar__heading"><strong>{month}</strong><nav><button onClick={()=>shift(-1)} aria-label={zh?'上个月':'Previous month'}>‹</button><button onClick={()=>shift(1)} aria-label={zh?'下个月':'Next month'}>›</button></nav></div><small>{new Intl.DateTimeFormat(zh?'zh-CN':'en-US',{month:'short',day:'numeric',weekday:'short'}).format(now)}</small><div className="live-calendar__grid">{week.map((day,i)=><b key={`w${i}`}>{day}</b>)}{days.map((day,i)=><span key={i} className={(day.getMonth()===shown.getMonth()?'':'adjacent')+(day.toDateString()===now.toDateString()?' today':'')}>{day.getDate()}</span>)}</div><div className="live-calendar__foot">{zh?'自由创作 · 随心组合':'CREATE FREELY · COMPOSE YOUR WAY'}</div></div>
}

function LiveFocus({ zh }) {
  const [minutes,setMinutes]=useState(25), [remaining,setRemaining]=useState(25*60), [running,setRunning]=useState(false)
  useEffect(()=>{if(!running)return;const timer=setInterval(()=>setRemaining(value=>Math.max(0,value-1)),1000);return()=>clearInterval(timer)},[running])
  useEffect(()=>{if(remaining===0)setRunning(false)},[remaining])
  const clock=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`
  const toggle=()=>{if(remaining===0)setRemaining(minutes*60);setRunning(value=>!value)}
  return <div className="live-focus"><div className="live-focus__top"><span>AURORA / FOCUS</span><small>{running?(zh?'专注中':'FOCUSING'):remaining===0?(zh?'已完成':'DONE'):(zh?'就绪':'READY')}</small></div><div className="live-focus__body"><div className="live-focus__dial"><span>{zh?'专注':'FOCUS'}</span><strong>{clock}</strong><small>{zh?'留一点时间，专注当下。':'A little room to breathe.'}</small></div><div className="live-focus__actions"><div>{[15,25,45,60].map(value=><button className={minutes===value?'selected':''} key={value} onClick={()=>{setMinutes(value);setRemaining(value*60);setRunning(false)}}>{value}m</button>)}</div><button className="focus-start" onClick={toggle}>{running?(zh?'暂停':'Pause'):remaining===0?(zh?'重新开始':'Start again'):(zh?'开始专注':'Start focus')}</button><button onClick={()=>{setRemaining(minutes*60);setRunning(false)}}>{zh?'重置':'Reset'}</button></div></div><div className="live-focus__foot">{zh?'专注模式':'FOCUS MODE'} <span>CREATE FREELY</span></div></div>
}

function CompanionPanel({ act, zh, focusOn, setFocusOn, focusMoved, setFocusMoved, presetName, setPresetName, scale, setScale, opacity, setOpacity }) {
  const desktopPage = act >= 3
  const components = ['Clock', 'Calendar', 'Focus']
  return <div className={`story-control act-${act}`} aria-label="BAP Companion composition panel">
    <div className="story-control__title">BAP Companion <span>- [] X</span></div>
    <div className="story-control__sidebar">
      <div className="control-brand"><span className="control-mark">b</span><b>BAP Companion</b></div>
      <div className="control-nav">
        <span>{zh ? '\u5df2\u5b89\u88c5' : 'Installed'}</span>
        {desktopPage ? <><span>{zh ? '\u9884\u8bbe' : 'Presets'}</span><b>{zh ? '\u684c\u9762' : 'Desktop'}</b></> : <><b>{zh ? '\u9884\u8bbe' : 'Presets'}</b><span>{zh ? '\u684c\u9762' : 'Desktop'}</span></>}
        <span>{zh ? '\u8bbe\u7f6e' : 'Settings'}</span>
      </div>
      <div className="control-status">BAP<br/><small>{zh ? 'Companion \u5df2\u5c31\u7eea' : 'Companion ready'}</small></div>
    </div>
    <div className="story-control__main">
      <div className="control-banner"><strong>{desktopPage ? (zh ? '\u684c\u9762' : 'Desktop') : (zh ? '\u7ec4\u5408\u9884\u8bbe' : 'Compose a preset')}</strong><span>{desktopPage ? (zh ? '\u5237\u65b0\u5c5e\u6027' : 'Refresh properties') : 'BAP Aurora'}</span></div>
      {desktopPage ? <div className="control-dual">
        <section><b>ACTIVE HOST</b><div className="control-host">BAP Aurora <small>Connected</small></div><b>DESKTOP COMPONENTS</b>
          {components.map(name => <div className={'story-control__item' + (name === 'Focus' && !focusOn ? ' is-off' : '')} key={name}>
            <img src={`./works/aurora-${name.toLowerCase()}.png`} alt=""/><div><strong>Aurora {name}</strong><small>{name === 'Focus' && !focusOn ? 'Disabled' : 'Running / Instance 01'}</small></div>
          </div>)}
        </section>
        <section><b>COMPONENT PROPERTIES</b><div className="control-property"><strong>Aurora Focus</strong><small>Layout and appearance</small>
          <label>Scale <input aria-label="Aurora Focus scale" type="range" min="80" max="140" value={scale} onChange={e=>setScale(Number(e.target.value))}/><em>{scale}%</em></label>
          <label>Opacity <input aria-label="Aurora Focus opacity" type="range" min="35" max="100" value={opacity} onChange={e=>setOpacity(Number(e.target.value))}/><em>{opacity}%</em></label>
        </div></section>
      </div> : <div className="control-presets">
        <section><b>PRESETS</b><div className="preset-entry selected">{presetName || (zh ? '\u5f53\u524d\u9884\u8bbe' : 'Current preset')}</div><button onClick={()=>setPresetName(zh ? '\u6211\u7684\u9884\u8bbe' : 'My preset')}>+ {zh ? '\u65b0\u5efa\u9884\u8bbe' : 'New preset'}</button></section>
        <section><b>SELECTED COMPONENTS</b>
          {components.map(name => <div className={'story-control__item' + (name === 'Focus' && !focusOn ? ' is-off' : '')} key={name}>
            <img src={`./works/aurora-${name.toLowerCase()}.png`} alt=""/><div><strong>Aurora {name}</strong><small>{name === 'Focus' && !focusOn ? 'Not in this preset' : 'Ready / Instance 01'}</small></div>
            {name === 'Focus' && <button className={'story-switch' + (focusOn ? ' on' : '')} onClick={()=>setFocusOn(v=>!v)} aria-label="toggle Aurora Focus"/>}
          </div>)}
          <div className="control-actions"><button onClick={()=>setFocusMoved(v=>!v)}>Move</button><button onClick={()=>setFocusOn(false)}>Remove</button><button onClick={()=>setFocusOn(true)}>Add component</button></div>
        </section>
      </div>}
      <div className="story-control__foot"><span className="live-dot"/> Connected to BAP Aurora</div>
    </div>
  </div>
}
export default function Scrollytelling({ lang = 'zh' }) {
  const zh = lang === 'zh'
  const [act, setAct] = useState(0)
  const [focusOn, setFocusOn] = useState(true)
  const [focusMoved, setFocusMoved] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [scale, setScale] = useState(112)
  const [opacity, setOpacity] = useState(82)
  const refs = useRef([])
  useEffect(() => {
    const nodes = refs.current.filter(Boolean)
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setAct(Number(entry.target.dataset.act))
    }), { rootMargin: '-44% 0px -44% 0px', threshold: 0 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])
  return <div className="story story--cinematic">
    <div className="story__stage" aria-label="Aurora desktop composition changes as you scroll">
      <div className={`story-frame act-${act}`}>
        <div className="story-frame__glow"/>
        <div className={`story-desktop act-${act}`}>
          <img className="story-aurora" src="./works/aurora-scene.png" alt="BAP Aurora blue and violet northern lights wallpaper"/>
          <div className="story-vignette"/>
          <div className="story-widget story-widget--clock visible"><LiveClock zh={zh}/></div>
          <div className="story-widget story-widget--calendar visible"><LiveCalendar zh={zh}/></div>
          <div className={'story-widget story-widget--focus' + (focusOn ? ' visible' : '') + (act === 3 ? ' featured' : '') + (focusMoved?' moved':'')} style={{'--focus-width':`${(act===3?34:26)*scale/112}%`,'--focus-opacity':opacity/100}}><LiveFocus zh={zh}/></div>
          <div className={'story-future' + (act >= 4 ? ' visible' : '')}><div className="story-future__sun"/><div><small className="en">THE NEXT CHAPTER - CONCEPT</small><small className="zh">{'\u540e\u7eed\u4e3b\u9898 - \u8bbe\u8ba1\u6982\u5ff5'}</small><strong>BAP Daybreak</strong><span className="en">A future theme direction · warm light, new horizons</span><span className="zh">未来主题方向 · 暖金晨光，远山云雾</span><em><span className="en">BAP Lock Screen Clock - planned</span><span className="zh">BAP Lock Screen Clock - {'\u8ba1\u5212\u4e2d'}</span></em></div><div className="story-future__brand"><img src="./icon-256.png" alt=""/><b>BAP</b><span className="en">Create Freely. Connect Seamlessly. Compose Your Way.</span><span className="zh">{'\u521b\u4f5c\u81ea\u7531 \u00b7 \u4f5c\u54c1\u4e92\u901a \u00b7 \u7ec4\u5408\u968f\u5fc3'}</span></div></div>
          <div className="story-desktop__caption"><span>BAP AURORA</span><i/> <span>WALLPAPER ENGINE</span></div>
        </div>
        <div className={'story-miniworks' + (act === 1 ? ' visible' : '')}><span>INDEPENDENT WORKS</span><div><img src="./works/aurora-clock.png" alt=""/><img src="./works/aurora-calendar.png" alt=""/><img src="./works/aurora-focus.png" alt=""/></div><small>Aurora Clock · Calendar · Focus</small></div>
        <CompanionPanel act={act} zh={zh} focusOn={focusOn} setFocusOn={setFocusOn} focusMoved={focusMoved} setFocusMoved={setFocusMoved} presetName={presetName} setPresetName={setPresetName} scale={scale} setScale={setScale} opacity={opacity} setOpacity={setOpacity}/>
        <div className="story-frame__number">0{act + 1}<span> / 05</span></div>
      </div>
      <div className="story-progress" aria-hidden="true"><span style={{transform:`scaleX(${(act + 1) / acts.length})`}}/></div>
    </div>
    <div className="story__steps">{acts.map((item, i) => <article key={item.tag[0]} data-act={i} ref={node => refs.current[i] = node} className={'story-step' + (act === i ? ' active' : '')}>
      <p className="story-step__tag"><span className="en">{item.tag[0]}</span><span className="zh">{item.tag[1]}</span></p>
      <h3><span className="en">{item.title[0]}</span><span className="zh">{item.title[1]}</span></h3>
      <p className="story-step__body"><span className="en">{item.body[0]}</span><span className="zh">{item.body[1]}</span></p>
      {i === 4 && <p className="story-step__note"><span className="zh">Daybreak 为未来主题方向；跨作品组合须以实际兼容性为准。</span><span className="en">Daybreak is a future theme direction. Composition depends on actual compatibility.</span></p>}
    </article>)}</div>
  </div>
}
