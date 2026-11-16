import { useEffect, useState } from 'react'
import Scrollytelling from './Scrollytelling.jsx'

// Bilingual helper: <T zh="..." en="..." />
const T = ({ zh, en }) => (
  <>
    <span className="zh">{zh}</span>
    <span className="en">{en}</span>
  </>
)

export default function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('bap-lang') || 'zh' } catch { return 'zh' }
  })

  // language -> <html> class
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('zh', lang === 'zh')
    root.classList.toggle('en', lang === 'en')
    root.setAttribute('lang', lang)
    try { localStorage.setItem('bap-lang', lang) } catch {}
  }, [lang])

  // nav shadow on scroll
  useEffect(() => {
    const nav = document.getElementById('nav')
    const onScroll = () => {
      if (nav) nav.style.boxShadow = window.scrollY > 12 ? '0 10px 30px -18px rgba(30,58,95,.25)' : 'none'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // reveal on scroll
  useEffect(() => {
    const items = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    items.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* ============ NAV ============ */}
      <header className="nav" id="nav">
        <div className="nav__inner">
          <a className="brand" href="#home" aria-label="BAP home">
            <span className="brand__mark" aria-hidden="true">
              <img src="./icon-256.png" alt="" width="30" height="30" />
            </span>
            <span className="brand__name">BAP</span>
          </a>

          <nav className="nav__links" aria-label="primary">
            <a href="#showcase"><T zh="作品" en="Showcase" /></a>
            <a className="ext" href="https://github.com/backdrop-augmentation-protocol/spec" target="_blank" rel="noopener"><T zh="协议规范" en="Protocol" /></a>
            <a className="ext" href="https://github.com/backdrop-augmentation-protocol/examples" target="_blank" rel="noopener"><T zh="示例" en="Examples" /></a>
          </nav>

          <div className="nav__right">
            <div className="nav__quick" aria-label="quick actions">
              <a className="nav__quick-btn steam" href="#showcase">
                <svg className="ic" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></svg>
                <T zh="官方作品" en="Official works" />
              </a>
              <a className="nav__quick-btn" href="https://github.com/backdrop-augmentation-protocol/companion/releases/latest" target="_blank" rel="noopener">
                <T zh="下载 Companion" en="Companion" />
              </a>
              <a className="nav__quick-btn" href="#faq">
                <T zh="常见问题" en="FAQ" />
              </a>
            </div>
            <button className="lang" onClick={() => setLang(l => (l === 'zh' ? 'en' : 'zh'))} aria-label="toggle language">
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
            <a className="icon-btn" href="https://github.com/backdrop-augmentation-protocol" target="_blank" rel="noopener" aria-label="GitHub">
              <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* ============ HERO (centered) + LIVE DEMO WINDOW ============ */}
      <section className="hero" id="home">
        <div className="hero__glow hero__glow--a" aria-hidden="true" />
        <div className="hero__glow hero__glow--b" aria-hidden="true" />
        <div className="hero__content">
          <p className="eyebrow">
            <span className="zh">为 Wallpaper Engine 打造的开放式桌面体验</span>
            <span className="en">Open Interoperability Protocol</span>
          </p>
          <h1 className="hero__title">
            <span className="zh">创作自由，作品互通，<em>组合随心</em></span>
            <span className="en">Create Freely.<br />Connect Seamlessly.<br /><em>Compose Your Way.</em></span>
          </h1>
          <p className="hero__lead">
            <span className="zh">一个基于Wallpaper Engine的壁纸增强拓展系统，旨在让普通用户随心组合壁纸与组件，让壁纸创作者们自由创作互通、兼容的作品。</span>
            <span className="en">A wallpaper extension system built on Wallpaper Engine, for users to combine wallpapers and components, and creators to make interoperable, compatible works.</span>
          </p>
          <div className="hero__cta">
            <a className="btn primary" href="#story"><T zh="看看桌面如何组合 ↓" en="Explore the experience ↓" /></a>
            <a className="btn outline" href="#showcase"><T zh="浏览官方作品" en="Explore the works" /></a>
          </div>
        </div>
      </section>

      {/* ============ SCROLLYTELLING (5 acts) ============ */}
      <section className="section reveal" id="story">
        <div className="wrap">
          <header className="sec-head">
            <p className="kicker"><T zh="发现BAP的不同" en="Discover what makes BAP different" /></p>
            <h2><T zh="从一张壁纸，展开更多可能" en="One wallpaper. More ways to make it yours." /></h2>
          </header>
      <Scrollytelling lang={lang} />
        </div>
      </section>

      {/* ============ WHAT IS BAP ============ */}
      <section className="section reveal" id="what">
        <div className="wrap">
          <header className="sec-head">
            <p className="kicker"><T zh="协议体系" en="The protocol" /></p>
            <h2><T zh="BAP 是什么？" en="What is BAP?" /></h2>
            <p className="sec-lead">
              <span className="zh">BAP 定义了一套开放约定，让「宿主壁纸」与「增强组件」在不必绑定同一作者、同一账号或同一 SDK 的前提下互相发现、组合与增强。</span>
              <span className="en">BAP defines open conventions so that "host wallpapers" and "augmenting components" can discover, combine, and enhance each other — without binding to the same author, account, or SDK.</span>
            </p>
          </header>

          <div className="pillars">
            <article className="pillar reveal">
              <div className="pillar__icon" style={{ '--c': '#12a8dc' }}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18" /></svg>
              </div>
              <h3><span className="zh">Host · 宿主壁纸</span><span className="en">Host</span></h3>
              <p>
                <span className="zh">独立可运行的背景作品。不依赖任何组件即可使用，是组合体验的「画布」。</span>
                <span className="en">A standalone background work. Usable with zero components — the canvas of the combined experience.</span>
              </p>
            </article>
            <article className="pillar reveal">
              <div className="pillar__icon" style={{ '--c': '#795bfc' }}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v18M3 12h18" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <h3><span className="zh">Component · 增强组件</span><span className="en">Component</span></h3>
              <p>
                <span className="zh">可叠加在宿主之上的增强层（时钟、音频、信息、特效）。同样可独立运行，也能与任意兼容 Host 组合。</span>
                <span className="en">An augmentation layer (clock, audio, info, FX) layered onto a host. Runs on its own and combines with any compatible host.</span>
              </p>
            </article>
            <article className="pillar reveal">
              <div className="pillar__icon" style={{ '--c': '#1d4df0' }}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12a8 8 0 0 1 14-5" /><path d="M20 12a8 8 0 0 1-14 5" /><circle cx="12" cy="12" r="2" fill="currentColor" /></svg>
              </div>
              <h3><span className="zh">Companion · 可选增强</span><span className="en">Companion</span></h3>
              <p>
                <span className="zh">可选的本地协调层，帮助组件发现并连接 Host。它不是使用 BAP 壁纸的必要前提。</span>
                <span className="en">An optional local coordinator that helps components find and connect to hosts. Not a requirement to use BAP wallpapers.</span>
              </p>
            </article>
          </div>

          {/* architecture diagram */}
          <div className="diagram reveal">
            <div className="diagram__col">
              <div className="node node--host">
                <span className="zh">宿主壁纸 Host</span><span className="en">Host wallpaper</span>
                <small><span className="zh">独立运行</span><span className="en">runs alone</span></small>
              </div>
              <div className="stack">
                <div className="node node--comp"><span className="zh">组件 A</span><span className="en">Component A</span></div>
                <div className="node node--comp"><span className="zh">组件 B</span><span className="en">Component B</span></div>
                <div className="node node--comp dim"><span className="zh">组件 C…</span><span className="en">Component C…</span></div>
              </div>
              <div className="node node--companion"><span className="zh">Companion（可选）</span><span className="en">Companion (optional)</span></div>
            </div>
            <div className="diagram__note">
              <h4><T zh="增强，而非依赖" en="Augmentation, not dependency" /></h4>
              <p>
                <span className="zh">壁纸移除所有组件后依然完整可用；组件离开某个 Host 也能独立存在。组合是「加分项」，不是「前提条件」。这也是 BAP 官网不会把「安装 Companion」描述成使用所有壁纸的必要步骤的原因。</span>
                <span className="en">A wallpaper stays complete without any component; a component exists on its own without a specific host. Combination is a bonus, never a prerequisite — which is why this site never frames "install Companion" as required for BAP wallpapers.</span>
              </p>
            </div>
          </div>

          {/* open-protocol principles */}
          <div className="principles reveal">
            <h3 className="principles__title"><T zh="开放协议原则" en="Open-protocol principles" /></h3>
            <ul>
              <li><span className="zh">不要求第三方采用官方 SDK</span><span className="en">No requirement to adopt the official SDK</span></li>
              <li><span className="zh">不强制统一视觉风格或发布账号</span><span className="en">No enforced visual style or publishing account</span></li>
              <li><span className="zh">兼容 ≠ 必须使用官方 SDK ≠ 官方出品</span><span className="en">Compatible ≠ must use official SDK ≠ official product</span></li>
              <li><span className="zh">作品独立发布、独立维护、独立署名</span><span className="en">Works are published, maintained, and credited independently</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============ SHOWCASE ============ */}
      <section className="section section--alt reveal" id="showcase">
        <div className="wrap">
          <header className="sec-head">
            <p className="kicker"><T zh="真实作品" en="Showcase" /></p>
            <h2><T zh="看看组合能做什么" en="See what combining looks like" /></h2>
            <p className="sec-lead">
              <span className="zh">Aurora 首批官方作品现已进入发行准备。作品将独立发布；目前尚未开放 Workshop 订阅。</span>
              <span className="en">The first official Aurora works are preparing for release. Each work will be published independently; Workshop subscriptions are not available yet.</span>
            </p>
          </header>

          <div className="cards">
            <article className="card reveal">
              <div className="card__preview card__preview--a card__preview--image">
                <img src="./works/aurora-scene.png" alt="BAP Aurora blue and violet northern lights" />
                <span className="card__tag">BAP Aurora · Host</span>
                <span className="card__badge"><T zh="待发布" en="Coming soon" /></span>
              </div>
              <div className="card__body">
                <h3>BAP Aurora</h3>
                <p><span className="zh">青蓝与紫色光流在深蓝夜幕中缓缓移动。一张完整的动态壁纸，也是一切组合的起点。</span><span className="en">Blue and violet light moves across the night. A complete wallpaper, and the starting point for every composition.</span></p>
              </div>
            </article>
            <article className="card reveal">
              <div className="card__preview card__preview--b card__preview--image">
                <img src="./works/aurora-clock.png" alt="Official BAP Aurora Clock preview" />
                <span className="card__tag">BAP Aurora Clock</span>
                <span className="card__badge"><T zh="待发布" en="Coming soon" /></span>
              </div>
              <div className="card__body">
                <h3><span className="zh">独立时钟组件</span><span className="en">An independent clock component</span></h3>
                <p><span className="zh">可单独运行，也可加入兼容的 Host。采用清晰克制的 Aurora 视觉语言。</span><span className="en">Runs on its own or joins a compatible host, in Aurora’s calm visual language.</span></p>
              </div>
            </article>
            <article className="card reveal">
              <div className="card__preview card__preview--c card__preview--image">
                <img src="./works/aurora-calendar.png" alt="Official BAP Aurora Calendar preview" />
                <span className="card__tag">BAP Aurora Calendar</span>
                <span className="card__badge"><T zh="待发布" en="Coming soon" /></span>
              </div>
              <div className="card__body">
                <h3><span className="zh">一眼掌握日期</span><span className="en">Your calendar at a glance</span></h3>
                <p><span className="zh">独立运行的交互式日历，可加入兼容 Host，并按自己的桌面布局调整。</span><span className="en">An interactive calendar that runs independently, joins compatible hosts and fits your layout.</span></p>
              </div>
            </article>
            <article className="card reveal">
              <div className="card__preview card__preview--c card__preview--image">
                <img src="./works/aurora-focus.png" alt="Official BAP Aurora Focus preview" />
                <span className="card__tag">BAP Aurora Focus</span>
                <span className="card__badge"><T zh="待发布" en="Coming soon" /></span>
              </div>
              <div className="card__body">
                <h3><span className="zh">留出专注时间</span><span className="en">Make room to focus</span></h3>
                <p><span className="zh">独立专注计时器，可按习惯选择时长，并搭配兼容的动态壁纸。</span><span className="en">An independent focus timer with flexible sessions, ready to join a compatible wallpaper.</span></p>
              </div>
            </article>
          </div>
          <p className="showcase__foot">
            <span className="zh">Aurora 全系列仍在发行准备中，开放订阅后即可在此找到作品入口。</span>
            <span className="en">The Aurora collection is preparing for release. Work links will be available here when subscriptions open.</span>
          </p>
        </div>
      </section>

      {/* ============ GET STARTED ============ */}
      <section className="section reveal" id="start">
        <div className="wrap">
          <header className="sec-head">
            <p className="kicker"><T zh="普通用户" en="Get started" /></p>
            <h2><T zh="三条上手路径" en="Three ways to begin" /></h2>
            <p className="sec-lead">
              <span className="zh">从你想做的事开始，按步骤完成第一次组合。</span>
              <span className="en">Start with what you want to do and follow the steps to your first composition.</span>
            </p>
          </header>

          <div className="paths">
            <div className="path reveal">
              <span className="path__num">1</span>
              <h3><T zh="使用一张壁纸" en="Use a wallpaper" /></h3>
              <ol>
                <li><span className="zh">在 Steam 订阅喜欢的 BAP 壁纸</span><span className="en">Subscribe to a BAP wallpaper on Steam</span></li>
                <li><span className="zh">它独立即可运行，无需任何组件</span><span className="en">It runs on its own — no component needed</span></li>
                <li><span className="zh">在 Wallpaper Engine 中设为桌面</span><span className="en">Set it as your desktop in Wallpaper Engine</span></li>
              </ol>
            </div>
            <div className="path reveal">
              <span className="path__num">2</span>
              <h3><span className="zh">独立运行一个组件</span><span className="en">Run a component alone</span></h3>
              <ol>
                <li><span className="zh">在 Steam Workshop 订阅一个组件作品——它本身就是一张可运行的 WE 壁纸</span><span className="en">Subscribe to a component work on Steam Workshop — it is itself a runnable WE wallpaper</span></li>
                <li><span className="zh">在 Wallpaper Engine 中直接设为桌面</span><span className="en">Set it as your desktop in Wallpaper Engine</span></li>
                <li><span className="zh">无需 Companion——独立模式不依赖任何额外工具</span><span className="en">No Companion needed — standalone mode depends on nothing else</span></li>
              </ol>
            </div>
            <div className="path reveal">
              <span className="path__num">3</span>
              <h3><span className="zh">组合壁纸与组件</span><span className="en">Combine wallpaper + component</span></h3>
              <ol>
                <li><span className="zh">在 Workshop 分别订阅 BAP 兼容壁纸与组件；作品可来自不同作者</span><span className="en">Subscribe to a BAP compatible wallpaper and components separately on Workshop; works can come from different creators</span></li>
                <li><span className="zh">在 Wallpaper Engine 中启用 Host，并确认它支持所选组件</span><span className="en">Set the host in Wallpaper Engine and confirm it supports the components you choose</span></li>
                <li><span className="zh">安装并启动可选的 BAP Companion，在 Host 授权提示中批准所需连接</span><span className="en">Install and launch the optional BAP Companion, then approve the requested host connection</span></li>
                <li><span className="zh">在「预设」中添加组件，选择要使用的作品并调整顺序</span><span className="en">Add components in Presets, choose the works you want, and arrange their order</span></li>
                <li><span className="zh">在「桌面」中查看运行实例，调整可用的位置、大小、透明度与组件属性</span><span className="en">In Desktop, inspect running instances and adjust available position, scale, opacity, and component properties</span></li>
                <li><span className="zh">组件不显示时，先检查 Host 授权、双方兼容性和作品版本</span><span className="en">If a component is missing, check host approval, compatibility, and work versions</span></li>
              </ol>
            </div>
          </div>

          <div className="faq" id="faq">
            <h3><T zh="常见问题" en="FAQ" /></h3>
            <details><summary><span className="zh">组件不显示怎么办？</span><span className="en">My component isn't showing.</span></summary>
              <p><span className="zh">确认 Companion 已安装并正在运行，且 Host 与组件均为 BAP 兼容版本。多数情况为版本不匹配。</span><span className="en">Make sure Companion is installed and running, and that both host and component are BAP-compatible versions. Most cases are version mismatches.</span></p>
            </details>
            <details><summary><span className="zh">必须用 Companion 才能用 BAP 壁纸吗？</span><span className="en">Do I need Companion to use BAP wallpapers?</span></summary>
              <p><span className="zh">不需要。壁纸本身独立可用；Companion 只是让组件更方便地与 Host 组合的可选项。</span><span className="en">No. Wallpapers work on their own; Companion is only an optional convenience for combining components with a host.</span></p>
            </details>
            <details><summary><span className="zh">以后出现新组件，要等壁纸作者更新吗？</span><span className="en">When new components appear, must I wait for the wallpaper author?</span></summary>
              <p><span className="zh">不需要。只要新组件与你的 Host 兼容（协议与能力匹配），即可在 BAPC 中加入已有桌面；实际可用性以真实兼容条件为准，并非任意组合都无条件成立。</span><span className="en">No. Any new component compatible with your host (protocol and capabilities match) can join your existing desktop via BAPC; actual availability follows real compatibility conditions — not every combination works unconditionally.</span></p>
            </details>
            <details><summary><span className="zh">第三方作品是官方的吗？</span><span className="en">Are third-party works official?</span></summary>
              <p><span className="zh">不是。展示或推荐不等于官方制作或背书，作品由各自作者独立发布与署名。</span><span className="en">No. Featuring is not endorsement; works are published and credited independently by their authors.</span></p>
            </details>
          </div>
        </div>
      </section>

      {/* ============ DEVELOPERS ============ */}
      <section className="section section--alt reveal" id="dev">
        <div className="wrap">
          <header className="sec-head">
            <p className="kicker"><T zh="开发者" en="Developers" /></p>
            <h2><T zh="接入协议" en="Build with BAP" /></h2>
            <p className="sec-lead">
              <span className="zh">规范权威来源为 spec 仓库，官方 SDK 仅为参考实现，不是兼容性强制前提。</span>
              <span className="en">The authoritative spec lives in the spec repo; the official SDK is a reference implementation, not a compatibility requirement.</span>
            </p>
          </header>

          <div className="dev-grid">
            <div className="dev-card reveal">
              <h3><span className="zh">Host · host-sdk（TS）</span><span className="en">Host · host-sdk (TS)</span></h3>
              <p><span className="zh">在 Wallpaper Engine 壁纸中挂载从 Companion 获取的自包含嵌入文档，无需另建壁纸项目。</span><span className="en">Inside a Wallpaper Engine wallpaper, mount the self-contained embedded document fetched from the Companion — no extra wallpaper project needed.</span></p>
            </div>
            <div className="dev-card reveal">
              <h3><span className="zh">Component · component-sdk</span><span className="en">Component · component-sdk</span></h3>
              <p><span className="zh">双模式组件：Standalone 独立运行，Embedded 经 iframe 运行在兼容 Host 中。</span><span className="en">Dual-mode components: run standalone, or embedded via iframe inside a compatible host.</span></p>
            </div>
            <div className="dev-card reveal">
              <h3><span className="zh">Companion 授权 · C#</span><span className="en">Companion approval · C#</span></h3>
              <p><span className="zh">Companion Server 仅监听本机回环；Desktop 通过命名管道审批 Host 会话。</span><span className="en">Companion Server binds to loopback only; the Desktop app approves host sessions over a named pipe.</span></p>
            </div>
          </div>

          <div className="dev-links reveal">
            <a href="https://github.com/backdrop-augmentation-protocol/spec" target="_blank" rel="noopener"><span className="zh">协议规范与 Schema →</span><span className="en">Protocol specification &amp; schemas →</span></a>
            <a href="https://github.com/backdrop-augmentation-protocol/host-sdk" target="_blank" rel="noopener"><span className="zh">Host SDK →</span><span className="en">Host SDK →</span></a>
            <a href="https://github.com/backdrop-augmentation-protocol/component-sdk" target="_blank" rel="noopener"><span className="zh">Component SDK →</span><span className="en">Component SDK →</span></a>
            <a href="https://github.com/backdrop-augmentation-protocol/conformance" target="_blank" rel="noopener"><span className="zh">一致性测试 →</span><span className="en">Conformance suite →</span></a>
            <a href="https://github.com/backdrop-augmentation-protocol/examples" target="_blank" rel="noopener"><span className="zh">端到端示例 →</span><span className="en">End-to-end examples →</span></a>
            <a href="https://github.com/backdrop-augmentation-protocol/companion" target="_blank" rel="noopener"><span className="zh">BAP Companion →</span><span className="en">BAP Companion →</span></a>
          </div>
        </div>
      </section>

      {/* ============ COMMUNITY ============ */}
      <section className="section reveal" id="community">
        <div className="wrap">
          <header className="sec-head">
            <p className="kicker"><T zh="社区与共建" en="Community" /></p>
            <h2><T zh="开放创作，独立署名" en="Open creation, independent credit" /></h2>
            <p className="sec-lead">
              <span className="zh">BAP 是开源协议。你可以独立创作、独立发布、保持署名，也可以与我们共研。</span>
              <span className="en">BAP is an open-source protocol. Create independently, publish independently, keep your credit — or co-build with us.</span>
            </p>
          </header>
          <div className="community">
            <a className="community__item reveal" href="https://github.com/backdrop-augmentation-protocol" target="_blank" rel="noopener">
              <h3><span className="zh">开源仓库</span><span className="en">Source repos</span></h3>
              <p><span className="zh">协议、SDK 与示例均公开</span><span className="en">Protocol, SDK, and examples are public</span></p>
            </a>
            <a className="community__item reveal" href="https://github.com/backdrop-augmentation-protocol/examples" target="_blank" rel="noopener">
              <h3><span className="zh">参与共建</span><span className="en">Build with us</span></h3>
              <p><span className="zh">从跨作品示例开始探索</span><span className="en">Explore end-to-end examples</span></p>
            </a>
            <a className="community__item reveal" href="#what">
              <h3><span className="zh">合作原则</span><span className="en">Contribution principles</span></h3>
              <p><span className="zh">开放、互操作、独立创作</span><span className="en">Open, interoperable, independent</span></p>
            </a>
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className="cta-band reveal">
        <div className="wrap">
          <h2>
            <span className="zh">从一张壁纸开始，构建互通的桌面生态</span>
            <span className="en">Start from one wallpaper. Build an interoperable desktop.</span>
          </h2>
          <p>
            <span className="zh">BAP 由全球创作者共同维护，规范、SDK 与示例全部开放。无论你是想发布作品还是参与共建，这里都有你的位置。</span>
            <span className="en">BAP is maintained by creators worldwide with open specs, SDKs, and examples. Whether you publish works or help build the protocol, you belong here.</span>
          </p>
          <div className="cta-band__actions">
            <a className="btn primary" href="https://github.com/backdrop-augmentation-protocol/spec" target="_blank" rel="noopener"><T zh="阅读协议规范 →" en="Read the protocol →" /></a>
            <a className="btn outline" href="#story"><T zh="看看如何自由组合" en="Explore the experience" /></a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="footer">
        <div className="wrap footer__grid">
          <div className="footer__brand">
            <span className="brand__name">BAP</span>
            <p><T zh="创作自由，作品互通，组合随心。" en="Create Freely. Connect Seamlessly. Compose Your Way." /></p>
          </div>
          <div className="footer__col">
            <h4><T zh="链接" en="Links" /></h4>
            <ul>
              <li><a href="https://github.com/backdrop-augmentation-protocol" target="_blank" rel="noopener">GitHub</a></li>
              <li><a href="https://steamcommunity.com/app/431960/workshop/" target="_blank" rel="noopener">Steam Workshop</a></li>
              <li><a href="#what">What is BAP</a></li>
            </ul>
          </div>
        </div>
        <div className="wrap footer__legal">
          <span>© <span id="year">{new Date().getFullYear()}</span> BAP Contributors</span>
          <span className="zh">自由创作，自在组合。</span>
          <span className="en">Create freely. Compose your way.</span>
        </div>
      </footer>
    </>
  )
}
