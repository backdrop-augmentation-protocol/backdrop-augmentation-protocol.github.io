import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const releasesUrl = 'https://api.github.com/repos/backdrop-augmentation-protocol/companion/releases?per_page=100'
const response = await fetch(releasesUrl, {
  headers: {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'BAP-website-release-sync'
  }
})

if (!response.ok) {
  throw new Error(`GitHub release lookup failed (${response.status})`)
}

const releases = await response.json()
const release = releases.find(item => !item.draft && item.published_at && item.assets.some(asset =>
  /^bap-companion-v\d+\.\d+\.\d+-win-x64\.zip$/i.test(asset.name)
))

if (!release) {
  throw new Error('No published BAP Companion Windows win-x64 package was found.')
}

const asset = release.assets.find(item => /^bap-companion-v\d+\.\d+\.\d+-win-x64\.zip$/i.test(item.name))
const version = release.tag_name.replace(/^v/i, '')
const manifest = {
  version,
  tag: release.tag_name,
  name: release.name || `BAP Companion ${release.tag_name}`,
  releaseUrl: release.html_url,
  publishedAt: release.published_at,
  prerelease: release.prerelease,
  asset: {
    name: asset.name,
    downloadUrl: asset.browser_download_url,
    size: asset.size,
    sha256: asset.digest?.startsWith('sha256:') ? asset.digest.slice('sha256:'.length) : null
  }
}

const output = fileURLToPath(new URL('../src/companion-release.json', import.meta.url))
await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log(`Synced BAP Companion ${version}: ${asset.name}`)
