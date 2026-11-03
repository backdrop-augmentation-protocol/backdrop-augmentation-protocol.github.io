import { useEffect, useRef, useState } from 'react'

// Interactive walkthrough of the REAL BAP handshake, with messages taken
// verbatim from companion/ (C#), host-sdk/ and examples/companion/client.js.
const STEPS = [
  {
    nodes: ['host', 'server'],
    label: { zh: '创建会话', en: 'Create session' },
    log: [
      'POST /v1/session',
      '{ "clientName": "BAP Host Wallpaper", "clientKind": "host",',
      '  "protocol": { "name": "bap", "version": "0.1.0", "profile": "core" } }',
      '200 OK → { "sessionId": "s_01J…", "accessToken": "bap_at_…", "expiresAt": "…" }',
    ],
  },
  {
    nodes: ['host', 'server'],
    label: { zh: 'WebSocket 握手 hello', en: 'WebSocket hello' },
    log: [
      'WS /v1/ws?token=bap_at_…',
      '→ { "kind": "request", "method": "hello",',
      '    "payload": { "role": "host",',
      '                 "requestedPermissions": ["component.discovery", "config.read"] } }',
      '← { "ok": true, "result": { "role": "companion",',
      '      "selectedProtocol": { "name": "bap", "version": "0.1.0", "profile": "core" } } }',
    ],
  },
  {
    nodes: ['host', 'server'],
    label: { zh: '组件发现', en: 'Component discovery' },
    log: [
      'GET /v1/components',
      'Authorization: Bearer bap_at_…',
      '200 OK → [{ "id": "example.clock", "modes": ["standalone", "embedded"], … }]',
    ],
  },
  {
    nodes: ['server', 'desktop'],
    label: { zh: 'Host 授权（命名管道）', en: 'Host approval (named pipe)' },
    log: [
      '// Companion.Desktop (C#) — NamedPipeClientStream',
      'var requests = await auth.GetPendingAsync(ct);',
      'await auth.DecideAsync(sessionId, approve: true, permissions, remember: true);',
      '// Companion.Server (C#) — NamedPipeServerStream · BAP_AUTHORIZATION_PIPE · CurrentUserOnly',
    ],
  },
  {
    nodes: ['host'],
    label: { zh: '挂载组件', en: 'Mount components' },
    log: [
      '// host-sdk · 在 Wallpaper Engine 壁纸内',
      'host.mount({ id: manifest.id, srcdoc: embeddedHtml, container });',
      '// iframe sandbox="allow-scripts" · 不透明 Origin · 单组件故障隔离',
    ],
  },
]

const NODE_LABELS = {
  host: { zh: 'Host 壁纸 · host-sdk', en: 'Host wallpaper · host-sdk' },
  server: { zh: 'Companion Server · C#', en: 'Companion Server · C#' },
  desktop: { zh: 'Desktop 授权 · C#', en: 'Desktop approval · C#' },
}

export default function SdkFlowDemo() {
  const [step, setStep] = useState(0)
  const termRef = useRef(null)

  // auto-play once on mount, one step at a time
  useEffect(() => {
    if (step >= STEPS.length) return undefined
    const t = setTimeout(() => setStep(s => s + 1), step === 0 ? 700 : 1600)
    return () => clearTimeout(t)
  }, [step])

  // keep terminal scrolled to the latest line
  useEffect(() => {
    const el = termRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [step])

  const done = step >= STEPS.length
  const active = done ? [] : STEPS[step].nodes
  const lines = STEPS.slice(0, step).flatMap(s => s.log)
  const current = done ? null : STEPS[step]

  return (
    <div className="flow">
      <div className="flow__nodes" aria-hidden="true">
        {Object.keys(NODE_LABELS).map(key => (
          <div key={key} className={'flow__node' + (active.includes(key) ? ' on' : '')} data-node={key}>
            <span className="zh">{NODE_LABELS[key].zh}</span>
            <span className="en">{NODE_LABELS[key].en}</span>
          </div>
        ))}
      </div>

      <div className="flow__step">
        {done
          ? <span className="zh">✓ 握手完成 — 组件已挂载，壁纸保持独立可用</span>
          : <span className="zh">步骤 {step + 1}/{STEPS.length} · {current.label.zh}</span>}
        {done
          ? <span className="en">✓ Handshake complete — components mounted; the wallpaper stays standalone.</span>
          : <span className="en">Step {step + 1}/{STEPS.length} · {current.label.en}</span>}
      </div>

      <pre className="flow__term" ref={termRef} aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={l.startsWith('//') || l.startsWith('#') ? 'dim' : ''}>{l}</div>
        ))}
        {!done && <div className="cursor" aria-hidden="true" />}
      </pre>

      <div className="flow__actions">
        <button className="tg" onClick={() => setStep(0)}>
          <span className="zh">↻ 重新播放</span><span className="en">↻ Replay</span>
        </button>
        <p className="flow__hint">
          <span className="zh">消息与代码均摘自真实仓库：companion/（C#）、host-sdk/ 与 examples/companion/client.js。</span>
          <span className="en">Messages and code are taken from the real repos: companion/ (C#), host-sdk/, and examples/companion/client.js.</span>
        </p>
      </div>
    </div>
  )
}
