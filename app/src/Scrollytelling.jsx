import { useEffect, useRef, useState } from 'react'

const acts = [
  { title: ['A new desktop experience.', '崭新的桌面体验。'], body: ['BAP uses runtime injection. Components are mounted dynamically onto a complete wallpaper instead of being bundled into the wallpaper itself.', 'BAP采用运行时注入机制。组件不再集成在壁纸作品中，而是在原有完整壁纸上动态挂载，带给你不一样的桌面体验。'] },
  { title: ['Works connect across creators.', '跨作品互联互通。'], body: ['BAP defines a shared protocol so wallpapers can work together. One component can be mounted on different wallpapers, and one wallpaper can host multiple components.', 'BAP通过协议统一的规范，让壁纸间互联互通。「同个组件挂载于不同壁纸」与「同个壁纸挂载多种组件」成为可能。'] },
  { tag: ['03 / YOUR DESKTOP', '03 / 你的桌面'], title: ['A desktop made your way.', '高度自定义的桌面。'], body: ['Components and wallpapers are independent. Replace what does not fit, then combine works from different creators to make a desktop that feels like yours.', '组件与壁纸相互独立，哪不满意换哪里。订阅各个创作者的作品，组合和搭配出只属于你独一无二的桌面。'] },
  { tag: ['04 / IN YOUR HANDS', '04 / 随心调整'], title: ['Simple, convenient controls.', '简易方便的操作入口。'], body: ['With BAP Companion, you can browse wallpapers, bind component instances and wallpapers to presets, and adjust wallpaper and component properties with ease.', '通过 BAP Companion，「查看壁纸列表」、「绑定组件实例与壁纸到预设方案」、「调整桌面壁纸与组件的属性」都能轻松实现。'] },
  { tag: ['05 / MORE WORKS', '05 / \u66f4\u591a\u4f5c\u54c1'], title: ['Start with Aurora. More works can join.', '\u4ece Aurora \u7cfb\u5217\u5f00\u59cb\uff0c\u66f4\u591a\u517c\u5bb9\u4f5c\u54c1\u4f1a\u9646\u7eed\u52a0\u5165\u3002'], body: ['Hosts and components are independent works you can combine.', 'Host \u548c Component \u5404\u81ea\u72ec\u7acb\uff0c\u53ef\u4ee5\u81ea\u7531\u7ec4\u5408\u3002'] },
]

const futureWorks = [
  { title:'BAP Aurora', kind:'Host', image:'./works/aurora-scene.png', alt:'BAP Aurora northern lights wallpaper' },
  { title:'BAP Aurora Clock', kind:'Component', image:'./works/aurora-clock.png', alt:'Aurora Clock preview' },
  { title:'BAP Aurora Calendar', kind:'Component', image:'./works/aurora-calendar.png', alt:'Aurora Calendar preview' },
  { title:'BAP Aurora Focus', kind:'Component', image:'./works/aurora-focus.png', alt:'Aurora Focus preview' },
]

function LiveClock({ zh }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer) }, [])
  const time = new Intl.DateTimeFormat(zh ? 'zh-CN' : 'en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }).format(now)
  const date = new Intl.DateTimeFormat(zh ? 'zh-CN' : 'en-US', { weekday:'short', month:'short', day:'numeric' }).format(now)
  return <div className="live-clock"><div className="live-clock__face"><span className="live-dot"/>{zh ? '极光 / 本地时间' : 'AURORA / LOCAL TIME'}</div><div className="live-clock__time">{time}</div><div className="live-clock__date">{date}</div><div className="live-clock__rule"/><div className="live-clock__foot">{zh ? '本地时间' : 'LOCAL TIME'}<span>◆</span></div></div>
}

function LiveCalendar({ zh }) {
  const [shown, setShown] = useState(() => new Date())
  const now = new Date()
  const first = new Date(shown.getFullYear(), shown.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const dayCount = new Date(shown.getFullYear(), shown.getMonth()+1, 0).getDate()
  const cellCount = Math.ceil((offset + dayCount) / 7) * 7
  const days = Array.from({length:cellCount},(_,index)=>new Date(shown.getFullYear(),shown.getMonth(),index-offset+1))
  const month = new Intl.DateTimeFormat(zh?'zh-CN':'en-US',{month:'short',year:'numeric'}).format(shown)
  const week = Array.from({length:7},(_,i)=>zh ? ['\u5468\u4e00','\u5468\u4e8c','\u5468\u4e09','\u5468\u56db','\u5468\u4e94','\u5468\u516d','\u5468\u65e5'][i] : new Intl.DateTimeFormat('en-US',{weekday:'short'}).format(new Date(2024,0,8+i)))
  const shift = amount => setShown(value=>new Date(value.getFullYear(),value.getMonth()+amount,1))
  return <div className="live-calendar"><div className="live-calendar__top"><b>{zh?'极光 / 日历':'AURORA / CALENDAR'}</b><button onClick={()=>setShown(new Date(now.getFullYear(),now.getMonth(),1))}>{new Intl.DateTimeFormat(zh?'zh-CN':'en-US',{month:'short',day:'numeric'}).format(now)}</button></div><div className="live-calendar__heading"><strong>{month}</strong><nav><button onClick={()=>shift(-1)} aria-label={zh?'上个月':'Previous month'}>‹</button><button onClick={()=>shift(1)} aria-label={zh?'下个月':'Next month'}>›</button></nav></div><small>{new Intl.DateTimeFormat(zh?'zh-CN':'en-US',{month:'short',day:'numeric',weekday:'short'}).format(now)}</small><div className="live-calendar__grid">{week.map((day,i)=><b key={`w${i}`}>{day}</b>)}{days.map((day,i)=><span key={i} className={(day.getMonth()===shown.getMonth()?'':'adjacent')+(day.toDateString()===now.toDateString()?' today':'')}>{day.getDate()}</span>)}</div></div>
}

function LiveFocus({ zh }) {
  const [minutes,setMinutes]=useState(25), [remaining,setRemaining]=useState(25*60), [running,setRunning]=useState(false)
  useEffect(()=>{if(!running)return;const timer=setInterval(()=>setRemaining(value=>Math.max(0,value-1)),1000);return()=>clearInterval(timer)},[running])
  useEffect(()=>{if(remaining===0)setRunning(false)},[remaining])
  const clock=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`
  const toggle=()=>{if(remaining===0)setRemaining(minutes*60);setRunning(value=>!value)}
  return <div className="live-focus"><div className="live-focus__top"><span>AURORA / FOCUS</span><small>{running?(zh?'专注中':'FOCUSING'):remaining===0?(zh?'已完成':'DONE'):(zh?'就绪':'READY')}</small></div><div className="live-focus__body"><div className="live-focus__dial"><span>{zh?'专注':'FOCUS'}</span><strong>{clock}</strong><small>{zh?'留一点时间，专注当下。':'A little room to breathe.'}</small></div><div className="live-focus__actions"><div>{[15,25,45,60].map(value=><button className={minutes===value?'selected':''} key={value} onClick={()=>{setMinutes(value);setRemaining(value*60);setRunning(false)}}>{value}m</button>)}</div><button className="focus-start" onClick={toggle}>{running?(zh?'暂停':'Pause'):remaining===0?(zh?'重新开始':'Start again'):(zh?'开始专注':'Start focus')}</button><button onClick={()=>{setRemaining(minutes*60);setRunning(false)}}>{zh?'重置':'Reset'}</button></div></div></div>
}

function DaybreakProgress() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer) }, [])
  const percent = Math.floor((now.getHours() * 60 + now.getMinutes()) / 14.4)
  const date = new Intl.DateTimeFormat('en-US', { weekday:'long', month:'long', day:'numeric' }).format(now)
  const time = new Intl.DateTimeFormat('en-GB', { hour:'2-digit', minute:'2-digit' }).format(now)
  return <div className="daybreak-progress"><header><span><i/> YOUR DAY, IN VIEW</span><time>{date}</time></header><div className="daybreak-progress__body"><div className="daybreak-progress__ring"><svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="80"/><circle className="progress" cx="90" cy="90" r="80" style={{strokeDashoffset:502.655*(1-percent/100)}}/></svg><div><strong>{percent}%</strong><small>OF YOUR DAY</small></div></div><div className="daybreak-progress__stats"><small>LOCAL TIME</small><strong>{time}</strong><span>TIME PASSED　{now.getHours()}h {now.getMinutes()}m</span><span>UNTIL MIDNIGHT　{23-now.getHours()}h {59-now.getMinutes()}m</span><div><i style={{width:`${percent}%`}}/></div></div></div></div>
}

function DaybreakAnalogClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer) }, [])
  const hour = now.getHours()%12 + now.getMinutes()/60
  const minute = now.getMinutes() + now.getSeconds()/60
  return <div className="daybreak-analog"><div className="daybreak-analog__dial">{Array.from({length:60},(_,i)=><i key={i} className={i%5===0?'major':''} style={{transform:`translate(-50%,-50%) rotate(${i*6}deg) translateY(-43%)`}}/>)}<i className="hour" style={{transform:`rotate(${hour*30}deg)`}}/><i className="minute" style={{transform:`rotate(${minute*6}deg)`}}/><i className="pin"/></div><div className="daybreak-analog__details"><span><i/> DAYBREAK · LOCAL TIME</span><strong>{new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric'}).format(now)}</strong><hr/><small>A QUIET MOMENT, WELL KEPT</small></div></div>
}

function DemoTimeWidget({ zh }) {
  const [now,setNow] = useState(() => new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer) }, [])
  return <div className="demo-time-widget"><small>BAP TIME WIDGET</small><strong>{new Intl.DateTimeFormat(zh?'zh-CN':'en-US',{hour:'2-digit',minute:'2-digit',hour12:false}).format(now)}</strong><span>{new Intl.DateTimeFormat(zh?'zh-CN':'en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(now)}</span></div>
}

function CompanionPanel({ act, phase, zh, focusOn, setFocusOn, presetName, scale, setScale, opacity, setOpacity }) {
  const page = act === 3 ? phase : 2
  const componentRows = ['Clock', 'Calendar', 'Focus'].map(name => ({ name, image:`./works/aurora-${name.toLowerCase()}.png` }))
  const pageName = [zh?'已安装':'Installed', zh?'预设':'Presets', zh?'桌面':'Desktop'][page] || 'Desktop'
  const thumbnail = name => <img src={`./works/aurora-${name.toLowerCase()}.png`} alt=""/>
  return <div className={`story-control act-${act} page-${page}`} aria-label="BAP Companion">
    <div className="story-control__title"><img src="./icon-256.png" alt=""/>BAP Companion <span><i/><i/><i/></span></div>
    <div className="story-control__sidebar">
      <div className="control-brand"><img src="./icon-256.png" alt=""/><div><b>BAP Companion</b><small>{zh?'壁纸管理器':'Wallpaper manager'}</small></div></div>
      <nav className="control-nav">
        {[zh?'已安装':'Installed',zh?'预设':'Presets',zh?'桌面':'Desktop',zh?'设置':'Settings'].map((name,index)=><div className={page===index?'selected':''} key={name}><i>{['▦','▤','▣','⚙'][index]}</i>{name}</div>)}
      </nav>
      <div className="control-status"><b>BAP</b><small><i/> {zh?'服务正在运行':'Service running'}</small></div>
    </div>
    <div className="story-control__main">
      <div className="control-banner"><div><strong>{pageName}</strong><small>{page===0?(zh?'浏览已安装的壁纸与组件':'Browse installed wallpapers and components'):page===1?(zh?'将组件与壁纸整理为预设方案':'Organize components and wallpapers into presets'):(zh?'查看当前壁纸及运行中的组件':'Current wallpaper and running components')}</small></div><button>{page===0?(zh?'刷新':'Refresh'):page===1?(zh?'新增预设':'New preset'):(zh?'刷新属性':'Refresh properties')}</button></div>
      {page===0 && <div className="companion-installed">
        <div className="companion-catalog">
          <section><h4>{zh?'壁纸':'Wallpapers'} <small>01</small></h4><div className="companion-entry selected"><img src="./works/aurora-scene.png" alt=""/><div><b>BAP Aurora</b><small>{zh?'本地项目 · 可用':'Local project · Ready'}</small></div></div></section>
          <section><h4>{zh?'组件':'Components'} <small>03</small></h4>{componentRows.map(({name,image})=><div className={'companion-entry'+(name==='Focus'?' companion-entry--last':'')} key={name}><img src={image} alt=""/><div><b>Aurora {name}</b><small>{zh?'本地项目 · 可用':'Local project · Ready'}</small></div></div>)}<div className="companion-more-mobile">{zh?'＋ 还有 1 个组件':'＋ 1 more component'}</div></section>
        </div>
        <aside className="companion-detail"><h4>{zh?'详情':'Details'}</h4><img src="./works/aurora-scene.png" alt=""/><b>BAP Aurora</b><span>{zh?'来源：本地项目':'Source: Local project'}</span><span>{zh?'状态：可用':'Status: Ready'}</span><span>{zh?'BAP 标识':'BAP ID'}: org.bap.official.aurora</span><button>{zh?'切换到此壁纸':'Switch wallpaper'}</button></aside>
      </div>}
      {page===1 && <div className="companion-presets">
        <aside className="companion-preset-list"><h4>{zh?'预设':'Presets'}</h4><div className="preset-entry selected">{presetName||'Aurora Desktop'}<small>{zh?'已启用':'Enabled'}</small></div><button>{zh?'＋ 新建预设':'＋ New preset'}</button><div className="companion-button-row"><button>{zh?'重命名':'Rename'}</button><button>{zh?'删除':'Delete'}</button></div></aside>
        <div className="companion-preset-content"><div className="companion-view-heading"><div><h4>{zh?'所选组件':'Selected components'}</h4><small>{zh?'决定此预设包含哪些作品与实例':'Choose the works and instances in this preset'}</small></div><div className="companion-tabs"><b>{zh?'组件':'Components'}</b><span>{zh?'壁纸':'Wallpapers'}</span></div></div>
          {componentRows.map(({name,image},index)=><div className="companion-entry" key={name}><img src={image} alt=""/><div><b>Aurora {name}</b><small>{zh?'实例':'Instance'} 0{index+1} · {zh?'本地项目':'Local project'}</small></div><span className="companion-check">✓</span></div>)}
          <div className="companion-button-row"><button>{zh?'移除':'Remove'}</button><button>{zh?'上移':'Move up'}</button><button>{zh?'下移':'Move down'}</button></div>
          <div className="companion-bound-host"><b>{zh?'绑定壁纸':'Bound wallpaper'}</b><div className="companion-entry"> <img src="./works/aurora-scene.png" alt=""/><div><b>BAP Aurora</b><small>{zh?'当前壁纸':'Current wallpaper'}</small></div><span className="companion-check">✓</span></div></div>
        </div>
      </div>}
      {page===2 && <div className="companion-desktop">
        <section className="companion-runtime"><h4>{zh?'当前壁纸':'Current wallpaper'}</h4><div className="companion-entry selected"><img src="./works/aurora-scene.png" alt=""/><div><b>BAP Aurora</b><small>{zh?'正在运行':'Running'}</small></div><span className="companion-check">●</span></div><h4>{zh?'运行中的组件':'Running components'}</h4>
          {componentRows.map(({name,image},index)=><div className={'companion-entry'+(name==='Focus'&&!focusOn?' disabled':'')} key={name} onClick={()=>name==='Focus'&&setFocusOn(v=>!v)}><img src={image} alt=""/><div><b>Aurora {name}</b><small>{zh?'实例':'Instance'} 0{index+1} · {focusOn||name!=='Focus'?(zh?'运行中':'Running'):(zh?'已禁用':'Disabled')}</small></div></div>)}
        </section>
        <section className="companion-properties"><h4>{zh?'组件属性':'Component properties'}</h4><p>{zh?'Aurora Focus · 实例 03':'Aurora Focus · Instance 03'}</p><small>{zh?'布局与外观':'Layout and appearance'}</small><label>{zh?'缩放':'Scale'}<input type="range" min="80" max="140" value={scale} onChange={e=>setScale(Number(e.target.value))}/><em>{scale}%</em></label><label>{zh?'透明度':'Opacity'}<input type="range" min="35" max="100" value={opacity} onChange={e=>setOpacity(Number(e.target.value))}/><em>{opacity}%</em></label><label>{zh?'位置 X':'Position X'}<input type="range" min="0" max="100" defaultValue="50"/><em>50%</em></label><label>{zh?'位置 Y':'Position Y'}<input type="range" min="0" max="100" defaultValue="50"/><em>50%</em></label></section>
      </div>}
    </div>
  </div>
}
export default function Scrollytelling({ lang = 'zh' }) {
  const zh = lang === 'zh'
  const [act, setAct] = useState(0)
  const [scenePhase, setScenePhase] = useState(0)
  const [focusOn, setFocusOn] = useState(true)
  const [focusMoved, setFocusMoved] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [scale, setScale] = useState(112)
  const [opacity, setOpacity] = useState(82)
  const refs = useRef([])
  const storyRef = useRef(null)
  const sceneRef = useRef({ act: 0, phase: 0 })
  const lastInputRef = useRef(0)
  const touchStartRef = useRef(null)
  sceneRef.current = { act, phase: scenePhase }
  useEffect(() => { setScenePhase(0) }, [act])
  useEffect(() => {
    const nodes = refs.current.filter(Boolean)
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setAct(Number(entry.target.dataset.act))
    }), { rootMargin: '-44% 0px -44% 0px', threshold: 0 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const root = storyRef.current
    if (!root) return
    const moveScene = direction => {
      const { act: currentAct, phase } = sceneRef.current
      if (currentAct > 3) return false
      const maxPhase = currentAct === 0 ? 3 : 2
      if (performance.now() - lastInputRef.current < 380) return true
      const nextPhase = phase + direction
      lastInputRef.current = performance.now()
      if (nextPhase >= 0 && nextPhase <= maxPhase) {
        sceneRef.current = { act: currentAct, phase: nextPhase }
        setScenePhase(nextPhase)
        return true
      }
      const nextAct = currentAct + direction
      if (nextAct >= 0 && nextAct < refs.current.length) {
        refs.current[nextAct]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return true
      }
      return false
    }
    const onWheel = event => {
      const direction = Math.sign(event.deltaY)
      if (!direction) return
      if (moveScene(direction)) event.preventDefault()
    }
    const onTouchStart = event => { touchStartRef.current = event.touches[0]?.clientY ?? null }
    const onTouchMove = event => {
      if (touchStartRef.current === null) return
      const distance = touchStartRef.current - event.touches[0].clientY
      const { act: currentAct, phase } = sceneRef.current
      const maxPhase = currentAct === 0 ? 3 : 2
      const hasScene = currentAct <= 3 && (distance > 0 ? phase < maxPhase || currentAct < 4 : phase > 0 || currentAct > 0)
      if (hasScene && Math.abs(distance) > 48) event.preventDefault()
    }
    const onTouchEnd = event => {
      if (touchStartRef.current === null) return
      const end = event.changedTouches[0]?.clientY
      const delta = end === undefined ? 0 : touchStartRef.current - end
      touchStartRef.current = null
      if (Math.abs(delta) > 48) moveScene(Math.sign(delta))
    }
    root.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('touchstart', onTouchStart, { passive: true })
    root.addEventListener('touchmove', onTouchMove, { passive: false })
    root.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('touchstart', onTouchStart)
      root.removeEventListener('touchmove', onTouchMove)
      root.removeEventListener('touchend', onTouchEnd)
    }
  }, [])
  const showClock = act === 2 ? scenePhase === 0 : act !== 0 || scenePhase >= 1
  const showCalendar = act === 2 ? scenePhase === 0 : act !== 0 || scenePhase >= 2
  const showFocus = act === 2 ? scenePhase === 0 && focusOn : act < 2 ? act === 1 || scenePhase >= 3 : focusOn
  const visualScale = act < 2 ? 112 : scale
  const visualOpacity = act < 2 ? 82 : opacity
  return <div className="story story--cinematic" ref={storyRef} data-scene-act={act} data-scene-phase={scenePhase}>
    <div className="story__stage" aria-label="Aurora desktop composition changes as you scroll">
      <div className={`story-frame act-${act}`}>
        <div className="story-frame__glow"/>
        <div className={`story-desktop act-${act} ${act <= 2 ? `phase-${scenePhase}` : ''}`}>
          <img className={'story-aurora story-aurora--base' + ((act === 1 && scenePhase > 0 || act === 2) ? ' is-away' : '')} src="./works/aurora-scene.png" alt="BAP Aurora blue and violet northern lights wallpaper"/>
          <img className={'story-aurora story-aurora--alt-one' + (act === 1 && scenePhase === 1 ? ' is-active' : '')} src="./works/background-placeholder-01.svg" alt="" aria-hidden="true"/>
          <img className={'story-aurora story-aurora--alt-two' + ((act === 1 && scenePhase === 2) || (act === 2 && scenePhase === 0) ? ' is-active' : '')} src="./works/background-placeholder-02.svg" alt="" aria-hidden="true"/>
          <img className={'story-aurora story-aurora--act2-one' + (act === 2 && scenePhase === 1 ? ' is-active' : '')} src="./works/background-placeholder-03.svg" alt="" aria-hidden="true"/>
          <img className={'story-aurora story-aurora--act2-two' + (act === 2 && scenePhase === 2 ? ' is-active' : '')} src="./works/background-placeholder-04.svg" alt="" aria-hidden="true"/>
          <div className="story-vignette"/>
          <div className={'story-widget story-widget--clock' + (showClock ? ' visible' : '')}><LiveClock zh={zh}/></div>
          <div className={'story-widget story-widget--calendar' + (showCalendar ? ' visible' : '')}><LiveCalendar zh={zh}/></div>
          <div className={'story-widget story-widget--focus' + (showFocus ? ' visible' : '') + (act === 3 ? ' featured' : '') + (act >= 2 && focusMoved?' moved':'')} style={{'--focus-width':`${(act===3?34:26)*visualScale/112}%`,'--focus-opacity':visualOpacity/100}}><LiveFocus zh={zh}/></div>
          <div className={'story-third-works' + (act===2&&scenePhase>0?' visible':'')}><div className="story-third-works__daybreak"><DaybreakProgress/><DaybreakAnalogClock/></div><DemoTimeWidget zh={zh}/></div>
          <div className={'story-future' + (act >= 4 ? ' visible' : '')}>
            <div className="story-future__works">
              {futureWorks.map(work => <article className="future-work" key={work.title}>
                <div className="future-work__image"><img src={work.image} alt={work.alt}/><span className="future-work__kind">{work.kind}</span></div>
                <strong>{work.title}</strong><small><span className="en">Coming soon</span><span className="zh">{'\u5f85\u53d1\u5e03'}</span></small>
              </article>)}
              <div className="future-work future-work--more"><div className="future-work__more-mark" aria-hidden="true">&hellip;</div><strong><span className="en">More works</span><span className="zh">{'\u66f4\u591a\u4f5c\u54c1'}</span></strong><small><span className="en">As they arrive</span><span className="zh">{'\u6301\u7eed\u52a0\u5165'}</span></small></div>
            </div>
          </div>
        </div>
        <div className={'story-miniworks' + (act === 1 ? ' visible' : '')}><span>INDEPENDENT WORKS</span><div><img src="./works/aurora-clock.png" alt=""/><img src="./works/aurora-calendar.png" alt=""/><img src="./works/aurora-focus.png" alt=""/></div><small>Aurora Clock · Calendar · Focus</small></div>
        <CompanionPanel act={act} phase={scenePhase} zh={zh} focusOn={focusOn} setFocusOn={setFocusOn} presetName={presetName} scale={scale} setScale={setScale} opacity={opacity} setOpacity={setOpacity}/>
      </div>
      <div className="story-progress" aria-hidden="true"><span style={{transform:`scaleX(${(act + 1) / acts.length})`}}/></div>
    </div>
    <div className="story__steps">{acts.map((item, i) => <article key={item.title[0]} data-act={i} ref={node => refs.current[i] = node} className={'story-step' + (act === i ? ' active' : '')}>
      <h3><span className="en">{item.title[0]}</span><span className="zh">{item.title[1]}</span></h3>
      <p className="story-step__body"><span className="en">{item.body[0]}</span><span className="zh">{item.body[1]}</span></p>
    </article>)}</div>
  </div>
}
