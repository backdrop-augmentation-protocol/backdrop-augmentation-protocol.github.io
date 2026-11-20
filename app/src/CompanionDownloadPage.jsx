import release from './companion-release.json'
import { CompanionPanel } from './Scrollytelling.jsx'

const T = ({ zh, en }) => <><span className="zh">{zh}</span><span className="en">{en}</span></>

function formatDate(value, lang) {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  }).format(new Date(value))
}

export default function CompanionDownloadPage({ lang, onToggleLanguage }) {
  const zh = lang === 'zh'
  const date = formatDate(release.publishedAt, lang)
  const size = `${(release.asset.size / 1024 / 1024).toFixed(1)} MB`
  return <main className="companion-page">
    <div className="companion-page__visual" aria-hidden="true">
      <div className="companion-page__ui-perspective" inert="">
        <CompanionPanel act={3} phase={2} zh={zh} />
      </div>
    </div>
    <header className="companion-page__nav">
      <a className="brand" href="./" aria-label="BAP home">
        <span className="brand__mark"><img src="./icon-256.png" alt="" width="32" height="32" /></span>
        <span className="brand__name">BAP</span>
      </a>
      <a className="companion-page__back" href="./"><T zh="返回 BAP 官网" en="Back to BAP" /></a>
      <button className="lang" onClick={onToggleLanguage} aria-label="toggle language">{zh ? 'EN' : '中文'}</button>
    </header>

    <section className="companion-download wrap">
      <p className="eyebrow"><T zh="BAP 桌面应用" en="BAP desktop app" /></p>
      <h1><T zh="BAP Companion" en="BAP Companion" /></h1>
      <p className="companion-download__lead"><T zh="管理兼容壁纸与组件，按自己的方式组合桌面。" en="Manage compatible wallpapers and components, and compose your desktop your way." /></p>

      <article className="companion-release">
        <div className="companion-release__identity">
          <img src="./icon-256.png" alt="BAP Companion" />
          <div>
            <p className="companion-release__label"><T zh="最新版本" en="Latest version" /></p>
            <h2>v{release.version}</h2>
          </div>
          {release.prerelease && <span className="companion-release__badge"><T zh="预览版" en="Preview" /></span>}
        </div>
        <p className="companion-release__name">{release.name}</p>
        <p className="companion-release__meta"><T zh="发布于" en="Released" /> {date} <span>·</span> Windows 10/11 · win-x64 <span>·</span> {size}</p>
        <div className="companion-release__actions">
          <a className="btn primary" href={release.asset.downloadUrl}>
            <T zh="下载 Windows 版" en="Download for Windows" />
            <span aria-hidden="true">↓</span>
          </a>
          <a className="btn outline" href={release.releaseUrl} target="_blank" rel="noopener noreferrer"><T zh="查看发行说明" en="Release notes" /> ↗</a>
        </div>
        <p className="companion-release__requirement"><T zh="无需单独安装 .NET Runtime。" en="No separate .NET runtime installation is required." /></p>
        {release.asset.sha256 && <details className="companion-release__checksum">
          <summary><T zh="校验下载文件" en="Verify download" /></summary>
          <code>SHA-256: {release.asset.sha256}</code>
        </details>}
      </article>

      <p className="companion-download__foot"><T zh="下载遇到问题？也可以在 GitHub 查看所有版本。" en="Having trouble downloading? Browse all versions on GitHub." /> <a href="https://github.com/backdrop-augmentation-protocol/companion/releases" target="_blank" rel="noopener noreferrer"><T zh="全部版本" en="All releases" /> ↗</a></p>
    </section>
  </main>
}
