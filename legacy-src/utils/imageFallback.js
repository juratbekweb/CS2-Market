const palette = [
  ['#1b2240', '#314d9a', '#71c7ff'],
  ['#24140a', '#9c4f14', '#ffd166'],
  ['#1a2620', '#237a57', '#6ee7b7'],
  ['#2a1724', '#b33f62', '#ff9fb2'],
  ['#1d1d2f', '#5b54d6', '#b8b5ff'],
  ['#23180c', '#ad7a1f', '#ffe29a'],
]

function hashText(value) {
  return Array.from(value).reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0)
}

function buildLabel(name) {
  const [weapon, skin] = name.split('|').map((part) => part.trim())
  const top = weapon ? weapon.slice(0, 18) : 'CS2 Skin'
  const bottom = skin ? skin.slice(0, 20) : 'Marketplace'
  return { top, bottom }
}

function buildSilhouette(name) {
  const normalized = (name || '').toLowerCase()

  if (normalized.includes('gloves') || normalized.includes('wraps')) {
    return `
      <g transform="translate(78 70)">
        <path d="M10 80 C8 55, 12 28, 18 10 C20 4, 28 4, 30 10 L34 34 C36 16, 38 6, 43 6 C48 6, 50 12, 50 18 L50 38 C52 18, 54 8, 60 8 C65 8, 67 14, 67 20 L67 42 C69 24, 72 14, 77 14 C82 14, 84 18, 84 24 L84 52 C88 40, 92 38, 98 40 C104 42, 105 49, 103 56 L90 106 C87 120, 75 130, 60 130 L38 130 C23 130, 12 121, 10 106 Z" fill="#f5f7ff" fill-opacity="0.92"/>
        <path d="M170 80 C172 55, 168 28, 162 10 C160 4, 152 4, 150 10 L146 34 C144 16, 142 6, 137 6 C132 6, 130 12, 130 18 L130 38 C128 18, 126 8, 120 8 C115 8, 113 14, 113 20 L113 42 C111 24, 108 14, 103 14 C98 14, 96 18, 96 24 L96 52 C92 40, 88 38, 82 40 C76 42, 75 49, 77 56 L90 106 C93 120, 105 130, 120 130 L142 130 C157 130, 168 121, 170 106 Z" fill="#f5f7ff" fill-opacity="0.92"/>
      </g>
    `
  }

  if (normalized.includes('knife') || normalized.includes('karambit') || normalized.includes('bayonet')) {
    return `
      <g transform="translate(56 80) rotate(-10 150 70)">
        <path d="M28 74 C110 26, 182 18, 244 28 C212 44, 170 64, 122 94 C92 113, 58 122, 24 118 C14 116, 8 104, 11 94 C14 84, 20 79, 28 74 Z" fill="#f2f4fa" fill-opacity="0.95"/>
        <path d="M44 96 L100 124 C112 130, 112 146, 100 152 L82 161 C68 168, 50 164, 41 151 L28 132 C20 120, 26 104, 39 99 Z" fill="#111827" fill-opacity="0.9"/>
        <circle cx="62" cy="131" r="14" fill="none" stroke="#9be7ff" stroke-width="6" stroke-opacity="0.9"/>
      </g>
    `
  }

  if (normalized.includes('awp') || normalized.includes('ssg') || normalized.includes('scout')) {
    return `
      <g transform="translate(28 92)">
        <rect x="40" y="42" width="210" height="18" rx="9" fill="#f7f8fc" fill-opacity="0.95"/>
        <rect x="112" y="22" width="82" height="14" rx="7" fill="#d2d8e8" fill-opacity="0.95"/>
        <rect x="98" y="12" width="32" height="12" rx="6" fill="#f7f8fc" fill-opacity="0.92"/>
        <path d="M212 60 L258 74 L238 88 L194 78 Z" fill="#f7f8fc" fill-opacity="0.95"/>
        <path d="M112 60 L138 102 L118 112 L88 72 Z" fill="#111827" fill-opacity="0.9"/>
        <rect x="12" y="46" width="42" height="8" rx="4" fill="#d2d8e8" fill-opacity="0.9"/>
      </g>
    `
  }

  return `
    <g transform="translate(30 92)">
      <rect x="28" y="42" width="202" height="20" rx="10" fill="#f6f8fc" fill-opacity="0.96"/>
      <path d="M208 44 L288 58 L280 80 L212 68 Z" fill="#f6f8fc" fill-opacity="0.96"/>
      <path d="M106 62 L128 112 L108 120 L84 76 Z" fill="#111827" fill-opacity="0.9"/>
      <path d="M82 52 L36 70 L34 60 L70 46 Z" fill="#d2d8e8" fill-opacity="0.9"/>
      <rect x="124" y="30" width="56" height="10" rx="5" fill="#d2d8e8" fill-opacity="0.9"/>
    </g>
  `
}

export function getSkinFallbackImage(name, width = 400, height = 300) {
  const normalizedName = name || 'CS2 Skin'
  const hash = Math.abs(hashText(normalizedName))
  const [bg, accent, glow] = palette[hash % palette.length]
  const { top, bottom } = buildLabel(normalizedName)
  const silhouette = buildSilhouette(normalizedName)

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
        <radialGradient id="glow" cx="75%" cy="20%" r="70%">
          <stop offset="0%" stop-color="${glow}" stop-opacity="0.9" />
          <stop offset="100%" stop-color="${glow}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="weaponTint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${glow}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="28" fill="url(#bg)" />
      <rect width="${width}" height="${height}" rx="28" fill="url(#glow)" />
      <circle cx="${width * 0.18}" cy="${height * 0.26}" r="${Math.round(height * 0.16)}" fill="${glow}" fill-opacity="0.12" />
      <circle cx="${width * 0.82}" cy="${height * 0.74}" r="${Math.round(height * 0.22)}" fill="#ffffff" fill-opacity="0.06" />
      <path d="M${width * 0.12} ${height * 0.68} L${width * 0.78} ${height * 0.34} L${width * 0.88} ${height * 0.48} L${width * 0.22} ${height * 0.82} Z" fill="#0b1020" fill-opacity="0.24" />
      <g transform="translate(${Math.round(width * 0.02)} ${Math.round(height * 0.01)}) scale(${width / 360} ${height / 240})">
        ${silhouette}
        <rect x="22" y="18" width="316" height="170" rx="26" fill="url(#weaponTint)" fill-opacity="0.16"/>
      </g>
      <rect x="${width * 0.08}" y="${height * 0.72}" width="${width * 0.84}" height="${height * 0.16}" rx="18" fill="#080b14" fill-opacity="0.48" />
      <rect x="${width * 0.08}" y="${height * 0.1}" width="${width * 0.84}" height="${height * 0.8}" rx="22" fill="none" stroke="#ffffff" stroke-opacity="0.15" />
      <text x="50%" y="79%" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.max(18, Math.round(width * 0.056))}" font-weight="700">${top}</text>
      <text x="50%" y="88%" text-anchor="middle" fill="${glow}" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.max(14, Math.round(width * 0.04))}" font-weight="600">${bottom}</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export function getAvatarFallback(label = 'U') {
  const initial = (label || 'U').trim().charAt(0).toUpperCase() || 'U'
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <defs>
        <linearGradient id="avatar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#24140a" />
          <stop offset="100%" stop-color="#c7881f" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="40" fill="url(#avatar)" />
      <text x="50%" y="56%" text-anchor="middle" fill="#fff7db" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="700">${initial}</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
