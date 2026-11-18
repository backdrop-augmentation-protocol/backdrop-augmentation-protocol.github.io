import { useEffect, useState } from 'react'
import Scrollytelling, { QuickStartStory } from './Scrollytelling.jsx'
import CompanionDownloadPage from './CompanionDownloadPage.jsx'

const COMPANION_DOWNLOAD_URL = './companion.html'

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

  if (window.location.pathname.endsWith('/companion.html')) {
    return <CompanionDownloadPage lang={lang} onToggleLanguage={() => setLang(l => (l === 'zh' ? 'en' : 'zh'))} />
  }

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
              <a className="nav__quick-btn" href={COMPANION_DOWNLOAD_URL} target="_blank" rel="noopener">
                <T zh="下载 Companion" en="Companion" />
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

      {/* ============ DISCOVER BAP ============ */}
      <section className="section reveal" id="story">
        <div className="wrap">
          <header className="sec-head">
            <p className="kicker"><T zh="发现BAP的不同" en="Discover what makes BAP different" /></p>
            <h2><T zh="从一张壁纸，展开更多可能" en="One wallpaper. More ways to make it yours." /></h2>
          </header>
      <Scrollytelling lang={lang} />
        </div>
      </section>

      {/* ============ QUICK START ============ */}
      <section className="section reveal" id="quickstart">
        <div className="wrap">
          <header className="sec-head">
            <p className="kicker"><T zh="初探 BAP" en="Getting started with BAP" /></p>
            <h2><T zh="快速上手" en="Quick start" /></h2>
          </header>
          <QuickStartStory lang={lang} companionUrl={COMPANION_DOWNLOAD_URL} />
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section section--alt reveal" id="faq">
        <div className="wrap">
          <header className="sec-head">
            <p className="kicker"><T zh="答疑解惑 BAP" en="BAP questions answered" /></p>
            <h2><T zh="常见问题" en="Frequently asked questions" /></h2>
          </header>
          <div className="faq faq--accordion">
            <details>
              <summary><T zh="什么是「宿主」和「组件」？" en="What are hosts and components?" /></summary>
              <p><span className="zh">「宿主」壁纸是独立可运行的背景作品，是桌面组合体验的「舞台」。「组件」是「宿主」壁纸的增强，通过运行时动态挂载到「宿主」壁纸，实现桌面功能与效果的拓展，是桌面组合体验的「舞者」。</span><span className="en">A host wallpaper is a standalone background work: the “stage” for a desktop composition. A component enhances a host by attaching to it at runtime, extending desktop features and effects. It is the “dancer” in the composition.</span></p>
            </details>
            <details>
              <summary><T zh="什么是 BAP Companion？" en="What is BAP Companion?" /></summary>
              <p><span className="zh">BAP Companion 是运行在桌面系统里的轻量级独立应用，用于组件发现、组件的动态挂载与桌面的自定义管理。</span><span className="en">BAP Companion is a lightweight, standalone desktop application for discovering components, mounting them dynamically, and managing a custom desktop.</span></p>
            </details>
            <details>
              <summary><T zh="什么是组件的「独立模式」和「嵌入模式」？" en="What are a component’s standalone and embedded modes?" /></summary>
              <p><span className="zh">在「独立模式」下，组件可以直接作为 Wallpaper Engine 壁纸运行，基本功能与外观均满足正常使用的要求。但此时您只能单独使用该组件，无法体验 BAP 最具特色的自由组合能力。</span><span className="en">In standalone mode, a component runs directly as a Wallpaper Engine wallpaper. Its core features and appearance are fully usable, but you can only use that component on its own, without BAP’s free composition.</span></p>
              <p><span className="zh">如果希望将多个组件与宿主壁纸自由搭配，可以使用 BAP Companion 管理桌面组合，组件会被动态挂载到兼容宿主中。此时组件便以「嵌入模式」运行。</span><span className="en">To combine multiple components with a host wallpaper, use BAP Companion to manage the desktop composition. The components are dynamically mounted into a compatible host and run in embedded mode.</span></p>
            </details>
            <details>
              <summary><T zh="所有 Wallpaper Engine 作品都支持 BAP 吗？" en="Do all Wallpaper Engine works support BAP?" /></summary>
              <p><span className="zh">不是。只有 Web 类型并且接入了 BAP 协议的作品才支持 BAP 体系下桌面级的「自由组合」。您可以在订阅前查看创意工坊作品描述，确认作品是否支持 BAP；订阅后，也可以通过 BAP Companion 自动发现支持 BAP 的壁纸作品。</span><span className="en">No. Only web-based works that implement the BAP protocol support desktop composition through BAP. Check a Workshop item’s description before subscribing, or use BAP Companion to discover compatible wallpapers after subscribing.</span></p>
            </details>
            <details>
              <summary><T zh="不启动 Wallpaper Engine 是否仍然可以享受 BAP 的桌面体验？" en="Can I use BAP’s desktop experience without running Wallpaper Engine?" /></summary>
              <p><span className="zh">不可以。BAP 是基于 Wallpaper Engine 的协议，壁纸的最终渲染仍然基于 Wallpaper Engine。</span><span className="en">No. BAP is a protocol built on Wallpaper Engine, and wallpapers are ultimately rendered by Wallpaper Engine.</span></p>
            </details>
            <details>
              <summary><T zh="BAP 是否支持 Linux 和 macOS 等其他桌面平台？" en="Does BAP support other desktop platforms such as Linux and macOS?" /></summary>
              <p><span className="zh">不支持。BAP 只支持 Windows 平台。这是因为 Wallpaper Engine 在桌面端只支持 Windows。</span><span className="en">No. BAP supports Windows only because Wallpaper Engine supports Windows only on desktop.</span></p>
            </details>
            <details>
              <summary><T zh="BAP 是 Steam 或 Wallpaper Engine 官方推出的项目吗？" en="Is BAP an official Steam or Wallpaper Engine project?" /></summary>
              <p><span className="zh">不是。BAP 是由第三方社区构建的开源项目，与 Steam 或 Wallpaper Engine 官方无关。</span><span className="en">No. BAP is an open-source project built by an independent community and is not affiliated with Steam or the official Wallpaper Engine team.</span></p>
            </details>
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
            <span className="zh">Aurora 系列的四件官方作品，均可点击下方链接查看。</span>
            <span className="en">Explore the four official Aurora works on Steam Workshop.</span>
          </p>
          </header>

          <div className="cards">
            <article className="card reveal">
              <div className="card__preview card__preview--a card__preview--image">
                <img src="./works/aurora-scene.png" alt="BAP Aurora blue and violet northern lights" />
                <span className="card__tag">BAP Aurora · Host</span>

              </div>
              <div className="card__body">
                <h3>BAP Aurora</h3>
                <p><span className="zh">青蓝与紫色光流在深蓝夜幕中缓缓移动。一张完整的动态壁纸，也是一切组合的起点。</span><span className="en">Blue and violet light moves across the night. A complete wallpaper, and the starting point for every composition.</span></p>
                <a className="card__link" href="https://steamcommunity.com/sharedfiles/filedetails/?id=3839632948" target="_blank" rel="noopener noreferrer"><T zh="查看创意工坊页面 →" en="View Workshop page →" /></a>
              </div>
            </article>
            <article className="card reveal">
              <div className="card__preview card__preview--b card__preview--image">
                <img src="./works/aurora-clock.png" alt="Official BAP Aurora Clock preview" />
                <span className="card__tag">BAP Aurora Clock</span>

              </div>
              <div className="card__body">
                <h3><span className="zh">独立时钟组件</span><span className="en">An independent clock component</span></h3>
                <p><span className="zh">可单独运行，也可加入兼容的 Host。采用清晰克制的 Aurora 视觉语言。</span><span className="en">Runs on its own or joins a compatible host, in Aurora’s calm visual language.</span></p>
                <a className="card__link" href="https://steamcommunity.com/sharedfiles/filedetails/?id=3840042528" target="_blank" rel="noopener noreferrer"><T zh="查看创意工坊页面 →" en="View Workshop page →" /></a>
              </div>
            </article>
            <article className="card reveal">
              <div className="card__preview card__preview--c card__preview--image">
                <img src="./works/aurora-calendar.png" alt="Official BAP Aurora Calendar preview" />
                <span className="card__tag">BAP Aurora Calendar</span>

              </div>
              <div className="card__body">
                <h3><span className="zh">一眼掌握日期</span><span className="en">Your calendar at a glance</span></h3>
                <p><span className="zh">独立运行的交互式日历，可加入兼容 Host，并按自己的桌面布局调整。</span><span className="en">An interactive calendar that runs independently, joins compatible hosts and fits your layout.</span></p>
                <a className="card__link" href="https://steamcommunity.com/sharedfiles/filedetails/?id=3839650362" target="_blank" rel="noopener noreferrer"><T zh="查看创意工坊页面 →" en="View Workshop page →" /></a>
              </div>
            </article>
            <article className="card reveal">
              <div className="card__preview card__preview--c card__preview--image">
                <img src="./works/aurora-focus.png" alt="Official BAP Aurora Focus preview" />
                <span className="card__tag">BAP Aurora Focus</span>

              </div>
              <div className="card__body">
                <h3><span className="zh">留出专注时间</span><span className="en">Make room to focus</span></h3>
                <p><span className="zh">独立专注计时器，可按习惯选择时长，并搭配兼容的动态壁纸。</span><span className="en">An independent focus timer with flexible sessions, ready to join a compatible wallpaper.</span></p>
                <a className="card__link" href="https://steamcommunity.com/sharedfiles/filedetails/?id=3840056290" target="_blank" rel="noopener noreferrer"><T zh="查看创意工坊页面 →" en="View Workshop page →" /></a>
              </div>
            </article>
          </div>
          <p className="showcase__foot">
            <span className="zh">点击作品卡片中的链接，可打开对应的 Steam 创意工坊页面。</span>
            <span className="en">Use the links on each card to open its Steam Workshop page.</span>
          </p>
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
              <li><a href="#story">Discover BAP</a></li>
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
