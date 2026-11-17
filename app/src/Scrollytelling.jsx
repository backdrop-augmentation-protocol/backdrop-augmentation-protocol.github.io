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

function CompanionPanel({ act, phase, zh }) {
  const page = act === 3 ? phase : 2
  const componentRows = ['Clock', 'Calendar', 'Focus'].map(name => ({ name, image:`./works/aurora-${name.toLowerCase()}.png` }))
  const [selectedInstalled,setSelectedInstalled] = useState('host')
  const [refreshNotice,setRefreshNotice] = useState('')
  const [presets,setPresets] = useState([{id:1,name:'Aurora Desktop',enabled:true,components:['Clock','Calendar','Focus'],bound:true}])
  const [selectedPresetId,setSelectedPresetId] = useState(1)
  const [presetTab,setPresetTab] = useState('components')
  const [selectedPresetItem,setSelectedPresetItem] = useState('Clock')
  const [editingPreset,setEditingPreset] = useState(false)
  const [draftPresetName,setDraftPresetName] = useState('')
  const [selectedDesktopTarget,setSelectedDesktopTarget] = useState('host')
  const [selectedDesktopComponent,setSelectedDesktopComponent] = useState('Focus')
  const [layoutMode,setLayoutMode] = useState('automatic')
  const [layoutValues,setLayoutValues] = useState({order:0,scale:1,rotation:0,opacity:1,zIndex:0,x:0,y:0,width:.25,height:.35})
  const [componentValues,setComponentValues] = useState({
    Clock:{showSeconds:true,showDate:true,timeFormat:'24-hour',locale:'system',appearance:'glass',fontScale:1,opacity:.88},
    Calendar:{locale:'system',dateFormat:'long',weekStart:'monday',showAdjacentDays:true,appearance:'glass',fontScale:1},
    Focus:{mode:'focus',duration:25,appearance:'glass',fontScale:1}
  })
  const [hostValues,setHostValues] = useState({brightness:.82,theme:'tide',motionSpeed:.5,quality:'high',color:'#061226'})
  const [layoutAnchor,setLayoutAnchor] = useState('top-left')
  const [presetOrder,setPresetOrder] = useState([1])
  const [presetStatus,setPresetStatus] = useState('')
  const selectedPreset = presets.find(item => item.id === selectedPresetId)
  const pageName = [zh?'已安装':'Installed', zh?'预设':'Presets', zh?'桌面':'Desktop'][page] || 'Desktop'
  const selectedCatalogItem = selectedInstalled === 'host'
    ? {name:'BAP Aurora',image:'./works/aurora-scene.png',kind:zh?'壁纸':'Wallpaper',id:'org.bap.official.aurora'}
    : (() => { const name=selectedInstalled.replace('component-',''); const item=componentRows.find(row=>row.name===name); return {name:`Aurora ${name}`,image:item?.image,kind:zh?'组件':'Component',id:`org.bap.official.aurora-${name.toLowerCase()}`} })()
  const flash = message => { setRefreshNotice(message); window.setTimeout(()=>setRefreshNotice(''),1800) }
  const updateSelectedPreset = update => setPresets(items=>items.map(item=>item.id===selectedPresetId?{...item,...update}:item))
  const movePreset = direction => {
    const index=presetOrder.indexOf(selectedPresetId),target=index+direction
    if(index<0||target<0||target>=presetOrder.length)return
    const next=[...presetOrder];[next[index],next[target]]=[next[target],next[index]];setPresetOrder(next)
  }
  const addPreset = () => {
    const id=Date.now()
    const name=zh?`新建预设 ${presets.length+1}`:`New preset ${presets.length+1}`
    setPresets(items=>[...items,{id,name,enabled:true,components:[],bound:false}])
    setPresetOrder(items=>[...items,id]);setSelectedPresetId(id);setEditingPreset(false)
  }
  const savePresetName = () => { if(draftPresetName.trim()) updateSelectedPreset({name:draftPresetName.trim()});setEditingPreset(false) }
  const removePreset = () => {
    const remaining=presets.filter(item=>item.id!==selectedPresetId)
    setPresets(remaining);setPresetOrder(items=>items.filter(id=>id!==selectedPresetId));setSelectedPresetId(remaining[0]?.id??-1);setEditingPreset(false)
  }
  const changePresetComponent = (name,add) => {
    if(!selectedPreset)return
    const next=add?[...selectedPreset.components,name]:selectedPreset.components.filter(item=>item!==name)
    updateSelectedPreset({components:next})
  }
  const movePresetComponent = direction => {
    if(!selectedPreset)return
    const index=selectedPreset.components.indexOf(selectedPresetItem)
    const target=index+direction
    if(index<0||target<0||target>=selectedPreset.components.length)return
    const next=[...selectedPreset.components];[next[index],next[target]]=[next[target],next[index]]
    updateSelectedPreset({components:next})
  }
  const addNextComponent = () => {
    const next=componentRows.find(item=>!selectedPreset?.components.includes(item.name))
    if(next){changePresetComponent(next.name,true);setSelectedPresetItem(next.name)}else flash(zh?'组件已全部加入':'All components are already added')
  }
  const pageAction = () => {
    if(page===0){setSelectedInstalled('host');flash(zh?'已刷新':'Refreshed')}
    if(page===2)flash(zh?'属性已刷新':'Properties refreshed')
  }
  const setLayoutValue = (key,value) => setLayoutValues(current=>({...current,[key]:Number(value)}))
  const setComponentValue = (key,value) => setComponentValues(current=>({...current,[selectedDesktopComponent]:{...current[selectedDesktopComponent],[key]:value}}))
  const setHostValue = (key,value) => setHostValues(current=>({...current,[key]:value}))
  const rangeField = (key,label,min,max,step=1,format=value=>value) => <label className="companion-property-row" key={key}><span>{label}</span><input type="range" min={min} max={max} step={step} value={layoutValues[key]} onChange={event=>setLayoutValue(key,event.target.value)}/><em>{format(layoutValues[key])}</em><button type="button" aria-label={zh?`减少${label}`:`Decrease ${label}`} onClick={()=>setLayoutValue(key,Math.max(min,Number(layoutValues[key])-step))}>−</button><button type="button" aria-label={zh?`增加${label}`:`Increase ${label}`} onClick={()=>setLayoutValue(key,Math.min(max,Number(layoutValues[key])+step))}>＋</button></label>
  const componentRangeField = (key,label,min,max,step=1,format=value=>value) => <label className="companion-property-row" key={key}><span>{label}</span><input type="range" min={min} max={max} step={step} value={selectedSettings[key]} onChange={event=>setComponentValue(key,Number(event.target.value))}/><em>{format(selectedSettings[key])}</em></label>
  const hostRangeField = (key,label,min,max,step=1,format=value=>value) => <label className="companion-property-row companion-property-row--host" key={key}><span>{label}</span><input type="range" min={min} max={max} step={step} value={hostValues[key]} onChange={event=>setHostValue(key,Number(event.target.value))}/><em>{format(hostValues[key])}</em></label>
  const hostColorOptions = ['#061226','#123D78','#21AFC7','#7C4DCC']
  const selectField = (key,label,value,options,onChange,kind='') => <label className={`companion-select-field ${kind}`} key={key}><span>{label}</span><select value={value} onChange={event=>onChange(event.target.value)}>{options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
  const toggleField = (key,label,value,onChange) => <label className="companion-toggle-field" key={key}><span>{label}</span><input type="checkbox" checked={value} onChange={event=>onChange(event.target.checked)}/></label>
  const selectedSettings = componentValues[selectedDesktopComponent]
  const componentSettings = selectedDesktopComponent==='Clock'
      ? <><h5>{zh?'组件属性':'Component properties'}</h5>{toggleField('showSeconds',zh?'显示秒数':'Show seconds',selectedSettings.showSeconds,value=>setComponentValue('showSeconds',value))}{toggleField('showDate',zh?'显示日期':'Show date',selectedSettings.showDate,value=>setComponentValue('showDate',value))}{selectField('timeFormat',zh?'时间格式':'Time format',selectedSettings.timeFormat,[{value:'24-hour',label:'24-hour'},{value:'12-hour',label:'12-hour'}],value=>setComponentValue('timeFormat',value))}{selectField('locale',zh?'语言':'Language',selectedSettings.locale,[{value:'system',label:zh?'系统':'System'},{value:'zh-CN',label:'简体中文'},{value:'en-US',label:'English'}],value=>setComponentValue('locale',value))}{selectField('appearance',zh?'外观':'Appearance',selectedSettings.appearance,[{value:'glass',label:zh?'玻璃卡片':'Glass card'},{value:'transparent',label:zh?'透明':'Transparent'}],value=>setComponentValue('appearance',value))}{componentRangeField('fontScale',zh?'文字大小':'Text size',.5,1.5,.01,value=>`${Number(value).toFixed(2)}`)}</>
    : selectedDesktopComponent==='Calendar'
      ? <><h5>{zh?'组件属性':'Component properties'}</h5>{selectField('locale',zh?'语言':'Language',selectedSettings.locale,[{value:'system',label:zh?'系统':'System'},{value:'zh-CN',label:'简体中文'},{value:'en-US',label:'English'}],value=>setComponentValue('locale',value))}{selectField('dateFormat',zh?'日期格式':'Date format',selectedSettings.dateFormat,[{value:'long',label:zh?'完整':'Long'},{value:'short',label:zh?'简短':'Short'},{value:'numeric',label:zh?'数字':'Numeric'}],value=>setComponentValue('dateFormat',value))}{selectField('weekStart',zh?'每周起始日':'First day of week',selectedSettings.weekStart,[{value:'monday',label:zh?'星期一':'Monday'},{value:'sunday',label:zh?'星期日':'Sunday'}],value=>setComponentValue('weekStart',value))}{toggleField('showAdjacentDays',zh?'显示相邻月份日期':'Show adjacent month dates',selectedSettings.showAdjacentDays,value=>setComponentValue('showAdjacentDays',value))}{selectField('appearance',zh?'外观':'Appearance',selectedSettings.appearance,[{value:'glass',label:zh?'玻璃卡片':'Glass card'},{value:'transparent',label:zh?'透明':'Transparent'}],value=>setComponentValue('appearance',value))}{componentRangeField('fontScale',zh?'文字大小':'Text size',.5,1.5,.01,value=>`${Number(value).toFixed(2)}`)}</>
      : <><h5>{zh?'组件属性':'Component properties'}</h5>{selectField('mode',zh?'计时模式':'Timer mode',selectedSettings.mode,[{value:'focus',label:zh?'专注':'Focus'},{value:'countdown',label:zh?'倒计时':'Countdown'}],value=>setComponentValue('mode',value))}{componentRangeField('duration',zh?'时长（分钟）':'Duration (minutes)',5,120,5,value=>`${value} min`)}{selectField('appearance',zh?'外观':'Appearance',selectedSettings.appearance,[{value:'glass',label:zh?'玻璃卡片':'Glass card'},{value:'transparent',label:zh?'透明':'Transparent'}],value=>setComponentValue('appearance',value))}{componentRangeField('fontScale',zh?'文字大小':'Text size',.5,1.5,.01,value=>`${Number(value).toFixed(2)}`)}</>
  const catalogCard = (id,title,subtitle,image) => <div role="button" tabIndex={0} aria-pressed={selectedInstalled===id} onClick={()=>setSelectedInstalled(id)} onKeyDown={event=>event.key==='Enter'&&setSelectedInstalled(id)} className={'companion-entry'+(selectedInstalled===id?' selected':'')+(id==='component-Focus'?' companion-entry--last':'')} key={id}><img src={image} alt=""/><div><b>{title}</b><small>{subtitle}</small></div></div>
  return <div className={`story-control act-${act} page-${page}`} aria-label="BAP Companion">
    <div className="story-control__title"><img src="./icon-256.png" alt=""/>BAP Companion <span><i/><i/><i/></span></div>
    <div className="story-control__sidebar">
      <div className="control-brand"><img src="./icon-256.png" alt=""/><div><b>BAP Companion</b><small>{zh?'壁纸管理器':'Wallpaper manager'}</small></div></div>
      <nav className="control-nav">
        {[zh?'已安装':'Installed',zh?'预设':'Presets',zh?'桌面':'Desktop',zh?'设置':'Settings'].map((name,index)=><div className={page===index?'selected':''} key={name}>{name}</div>)}
      </nav>
      <div className="control-status"><b>BAP</b><small><i/> {zh?'服务正在运行':'Service running'}</small></div>
    </div>
    <div className="story-control__main">
      <div className="control-banner"><div><strong>{pageName}</strong><small>{page===0?(zh?'本地项目与创意工坊订阅内容可以混合使用。':'Local projects and Workshop subscriptions can be used together.'):page===1?(zh?'选择组件并指定预设的应用范围。':'Choose components and specify where presets apply.'):(zh?'这里显示正在运行的壁纸和组件实例。此处修改只作用于当前桌面，不会修改预设。':'View the running wallpaper and component instances. Changes here apply to the current desktop only.')}</small></div>{page!==1&&<button onClick={pageAction}>{refreshNotice|| (page===0?(zh?'刷新内容库':'Refresh library'):(zh?'刷新属性':'Refresh properties'))}</button>}</div>
      {page===0 && <div className="companion-installed">
        <div className="companion-catalog">
          <section><h4>{zh?'壁纸':'Wallpapers'} <small>01</small></h4>{catalogCard('host','BAP Aurora',zh?'本地项目 · 可用':'Local project · Ready','./works/aurora-scene.png')}</section>
          <section><h4>{zh?'组件':'Components'} <small>03</small></h4>{componentRows.map(({name,image})=>catalogCard(`component-${name}`,`Aurora ${name}`,zh?'本地项目 · 可用':'Local project · Ready',image))}<div className="companion-more-mobile">{zh?'＋ 还有 1 个组件':'＋ 1 more component'}</div></section>
        </div>
        <aside className="companion-detail"><h4>{zh?'详情':'Details'}</h4><img src={selectedCatalogItem.image} alt=""/><b>{selectedCatalogItem.name}</b><span>{zh?'来源：本地项目':'Source: Local project'}</span><span>{zh?'状态：可用':'Status: Ready'}</span><span>{selectedCatalogItem.kind} · {selectedCatalogItem.id}</span>{selectedInstalled==='host'&&<><button onClick={()=>flash(zh?'已切换到此壁纸':'Wallpaper switched')}>{zh?'切换到此壁纸':'Switch wallpaper'}</button>{refreshNotice&&<small className="companion-feedback">{refreshNotice}</small>}</>}</aside>
      </div>}
      {page===1 && <div className="companion-presets">
        <aside className="companion-preset-list"><h4>{zh?'预设':'Presets'}</h4>{presetOrder.map(id=>presets.find(item=>item.id===id)).filter(Boolean).map(item=><div role="button" aria-pressed={selectedPresetId===item.id} tabIndex={0} onClick={()=>{setSelectedPresetId(item.id);setEditingPreset(false)}} onKeyDown={event=>event.key==='Enter'&&setSelectedPresetId(item.id)} className={'preset-entry'+(selectedPresetId===item.id?' selected':'')} key={item.id}>{item.name}</div>)}<div className="companion-preset-actions"><button className="primary" onClick={addPreset}>{zh?'新建预设':'New preset'}</button><div><button disabled={!selectedPreset} onClick={()=>{setDraftPresetName(selectedPreset?.name||'');setEditingPreset(true)}}>{zh?'重命名':'Rename'}</button><button disabled={!selectedPreset} onClick={removePreset}>{zh?'删除':'Delete'}</button></div><div><button aria-label={zh?'优先级上移':'Move preset up'} disabled={!selectedPreset||presetOrder.indexOf(selectedPresetId)===0} onClick={()=>movePreset(-1)}>{zh?'↑ 优先':'↑ Order'}</button><button aria-label={zh?'优先级下移':'Move preset down'} disabled={!selectedPreset||presetOrder.indexOf(selectedPresetId)===presetOrder.length-1} onClick={()=>movePreset(1)}>{zh?'↓ 优先':'↓ Order'}</button><button disabled={!selectedPreset} onClick={()=>selectedPreset&&updateSelectedPreset({enabled:!selectedPreset.enabled})}>{selectedPreset?.enabled?(zh?'停用':'Disable'):(zh?'启用':'Enable')}</button></div></div>{editingPreset&&<div className="companion-rename"><input aria-label="Preset name" value={draftPresetName} onChange={event=>setDraftPresetName(event.target.value)} onKeyDown={event=>event.key==='Enter'&&savePresetName()}/><button onClick={savePresetName}>{zh?'保存':'Save'}</button></div>}</aside>
        <div className="companion-preset-content"><div className="companion-view-heading"><h4>{presetTab==='components'?(zh?'此预设中的组件 · 从上到下为显示顺序':'Components in this preset · Ordered top to bottom'):(zh?'使用此预设的宿主':'Hosts using this preset')}</h4><div className="companion-tabs"><button aria-pressed={presetTab==='components'} className={presetTab==='components'?'active':''} onClick={()=>setPresetTab('components')}>{zh?'组件':'Components'}</button><button aria-pressed={presetTab==='hosts'} className={presetTab==='hosts'?'active':''} onClick={()=>setPresetTab('hosts')}>{zh?'宿主':'Hosts'}</button></div></div>
          <div className="companion-preset-items">{presetTab==='components' ? selectedPreset?.components.map((name,index)=>{const row=componentRows.find(item=>item.name===name);return <div role="button" aria-pressed={selectedPresetItem===name} tabIndex={0} onClick={()=>setSelectedPresetItem(name)} className={'companion-entry'+(selectedPresetItem===name?' selected':'')} key={`${name}-${index}`}><img src={row?.image} alt=""/><div><b>BAP Aurora {name}</b><small>{zh?'本地项目':'Local project'}</small><small>{zh?'可用 · 实例':'Ready · Instance'} {index+1}</small></div></div>}) : selectedPreset?.bound&&<div role="button" tabIndex={0} aria-pressed={selectedPresetItem==='host'} className={'companion-entry'+(selectedPresetItem==='host'?' selected':'')} onClick={()=>setSelectedPresetItem('host')}><img src="./works/aurora-scene.png" alt=""/><div><b>BAP Aurora</b><small>{zh?'本地项目':'Local project'}</small><small>{zh?'当前壁纸':'Current wallpaper'}</small></div></div>}</div>
          <div className="companion-preset-bottom">{presetTab==='components'?<><button className="primary" disabled={!selectedPreset} onClick={addNextComponent}>{zh?'添加组件':'Add component'}</button><div className="companion-preset-row"><button disabled={!selectedPreset||!selectedPreset.components.includes(selectedPresetItem)} onClick={()=>changePresetComponent(selectedPresetItem,false)}>{zh?'移除':'Remove'}</button><button disabled={!selectedPreset||selectedPreset.components.indexOf(selectedPresetItem)<=0} onClick={()=>movePresetComponent(-1)}>{zh?'上移':'Move up'}</button><button disabled={!selectedPreset||selectedPreset.components.indexOf(selectedPresetItem)<0||selectedPreset.components.indexOf(selectedPresetItem)>=selectedPreset.components.length-1} onClick={()=>movePresetComponent(1)}>{zh?'下移':'Move down'}</button></div></>:<><button className="primary" disabled={!selectedPreset} onClick={()=>{updateSelectedPreset({bound:true});setPresetStatus(zh?'已添加壁纸':'Wallpaper added')}}>{zh?'添加宿主':'Add host'}</button><div className="companion-preset-row"><button className={selectedPreset?.bound?'primary':''} disabled={!selectedPreset} onClick={()=>{updateSelectedPreset({bound:true});setPresetStatus(zh?'已设为全局预设':'Set as global preset')}}>{zh?'设为全局':'Set global'}</button><button disabled={!selectedPreset?.bound} onClick={()=>{updateSelectedPreset({bound:false});setPresetStatus(zh?'已移除宿主':'Host removed')}}>{zh?'移除宿主':'Remove host'}</button></div></>}{editingPreset&&<span className="companion-feedback">{zh?'请在左侧保存预设名称':'Save the preset name on the left'}</span>}<small>{presetStatus||`${zh?'全局':'Global'}: ${selectedPreset?.name??'—'} · ${zh?'宿主专用设置':'Host overrides'}: ${selectedPreset?.bound?1:0}`}</small></div>
        </div>
      </div>}
      {page===2 && <div className="companion-desktop">
        <section className="companion-runtime"><h4>{zh?'当前壁纸':'Current wallpaper'}</h4><div role="button" tabIndex={0} aria-pressed={selectedDesktopTarget==='host'} className={'companion-entry'+(selectedDesktopTarget==='host'?' selected':'')} onClick={()=>setSelectedDesktopTarget('host')} onKeyDown={event=>event.key==='Enter'&&setSelectedDesktopTarget('host')}><img src="./works/aurora-scene.png" alt=""/><div><b>BAP Aurora</b><small>{zh?'正在运行':'Running'}</small></div></div><h4>{zh?'运行中的组件':'Running components'}</h4>
          {componentRows.map(({name,image},index)=><div role="button" tabIndex={0} aria-pressed={selectedDesktopTarget===name} className={'companion-entry'+(name===selectedDesktopComponent&&selectedDesktopTarget===name?' selected':'')} key={name} onClick={()=>{setSelectedDesktopTarget(name);setSelectedDesktopComponent(name)}} onKeyDown={event=>event.key==='Enter'&&(setSelectedDesktopTarget(name),setSelectedDesktopComponent(name))}><img src={image} alt=""/><div><b>Aurora {name}</b><small>{zh?'实例':'Instance'} 0{index+1} · {zh?'运行中':'Running'}</small></div></div>)}
        </section>
        <section className="companion-properties"><h4>{selectedDesktopTarget==='host'?(zh?'宿主属性':'Host properties'):(zh?'组件属性':'Component properties')}</h4><p>{selectedDesktopTarget==='host'?`${zh?'BAP Aurora · 设置保存在此宿主项目，并同步到当前壁纸。':'BAP Aurora · Settings are saved for this host and applied to the current wallpaper.'}`:`BAP Aurora ${selectedDesktopComponent} · ${zh?'实例':'Instance'} 0${componentRows.findIndex(item=>item.name===selectedDesktopComponent)+1}`}<small>{selectedDesktopTarget!=='host'&&(zh?'此实例的实时属性。修改不会影响预设。':'Live properties for this instance. Changes do not affect presets.')}</small></p>{selectedDesktopTarget==='host'?<div className="companion-property-list"><h5>{zh?'配色':'Color'}</h5><button className="companion-color-button" onClick={()=>setHostValue('color',hostColorOptions[(hostColorOptions.indexOf(hostValues.color)+1)%hostColorOptions.length])}><i style={{background:hostValues.color}}/>{hostValues.color.toUpperCase()}</button>{hostRangeField('brightness','Brightness',.2,1,.01,value=>Number(value).toFixed(2))}{selectField('theme','Aurora palette',hostValues.theme,[{value:'tide',label:'Tidal light'},{value:'veil',label:'Celestial veil'},{value:'orbit',label:'Orbital bloom'}],value=>setHostValue('theme',value),'host-field')}{hostRangeField('motionSpeed','Motion speed',0,1,.01,value=>Number(value).toFixed(2))}{selectField('quality','Quality',hostValues.quality,[{value:'high',label:'High'},{value:'low',label:'Low'}],value=>setHostValue('quality',value),'host-field')}</div>:<div className="companion-property-list"><h5>{zh?'变换':'Transform'}</h5>{selectField('layoutMode',zh?'布局方式':'Layout mode',layoutMode,[{value:'automatic',label:zh?'自动布局':'Automatic'},{value:'manual',label:zh?'手动布局':'Manual'}],setLayoutMode)}{layoutMode==='manual'&&<>{selectField('anchor',zh?'锚点':'Anchor',layoutAnchor,[{value:'top-left',label:zh?'左上':'Top left'},{value:'center',label:zh?'居中':'Center'},{value:'bottom-right',label:zh?'右下':'Bottom right'}],setLayoutAnchor)}{rangeField('x',zh?'位置 X':'Position X',-2,2,.01,value=>Number(value).toFixed(2))}{rangeField('y',zh?'位置 Y':'Position Y',-2,2,.01,value=>Number(value).toFixed(2))}{rangeField('width',zh?'宽度':'Width',.01,2,.01,value=>Number(value).toFixed(2))}{rangeField('height',zh?'高度':'Height',.01,2,.01,value=>Number(value).toFixed(2))}</>}{layoutMode==='automatic'&&rangeField('order',zh?'顺序':'Order',0,10,1)}{rangeField('scale',zh?'缩放':'Scale',.1,3,.01,value=>Number(value).toFixed(2))}{rangeField('rotation',zh?'旋转':'Rotation',-180,180,1,value=>`${value}°`)}{rangeField('opacity',zh?'不透明度':'Opacity',0,1,.01,value=>Number(value).toFixed(2))}{rangeField('zIndex',zh?'层级':'Z-index',-10,10,1)}{componentSettings}</div>}</section>
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
        <CompanionPanel act={act} phase={scenePhase} zh={zh}/>
      </div>
      <div className="story-progress" aria-hidden="true"><span style={{transform:`scaleX(${(act + 1) / acts.length})`}}/></div>
    </div>
    <div className="story__steps">{acts.map((item, i) => <article key={item.title[0]} data-act={i} ref={node => refs.current[i] = node} className={'story-step' + (act === i ? ' active' : '')}>
      <h3><span className="en">{item.title[0]}</span><span className="zh">{item.title[1]}</span></h3>
      <p className="story-step__body"><span className="en">{item.body[0]}</span><span className="zh">{item.body[1]}</span></p>
    </article>)}</div>
  </div>
}
