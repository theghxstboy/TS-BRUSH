import { icons } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  siInstagram, siFacebook, siWhatsapp, siYoutube, siTiktok, siX, siLinkedin,
  siPinterest, siTelegram, siSnapchat, siDiscord, siTwitch, siGoogle, siApple,
  siAmazon, siShopify, siWordpress, siNotion, siSlack, siZoom, siStripe,
  siPaypal, siMercadopago, siCanva, siFigma, siAdobe, siBehance, siDribbble,
  siSpotify, siNetflix, siGithub, siGooglemaps, siGoogleplay, siAppstore,
  siUber, siIfood, siAirbnb, siTripadvisor,
  siVisa, siMastercard,
} from 'simple-icons'

// --- Lucide ---
const ICON_MAP = icons as Record<string, LucideIcon>
export const ICON_NAMES = Object.keys(ICON_MAP)

export function getLucideIcon(name: string): LucideIcon | null {
  return ICON_MAP[name] ?? null
}

const SOCIAL_DEFAULTS = [
  'Star','Heart','ThumbsUp','MessageSquare','MessageCircle','Send','Share2',
  'Image','Images','Camera','Video','Film','Play','Mic','Music',
  'Info','HelpCircle','AlertCircle','CheckCircle','BadgeCheck',
  'User','Users','UserRound','UserCircle','Smile','Baby',
  'Phone','PhoneCall','Mail','Globe','Link','ExternalLink',
  'ShoppingBag','ShoppingCart','Tag','Gift','Package','Truck',
  'Briefcase','Building2','Store','Handshake','Award','Trophy',
  'Target','Compass','Eye','Lightbulb','Rocket','Zap',
  'BookOpen','Book','GraduationCap','Pencil','ClipboardList',
  'Calendar','Clock','Bell','BellRing','Megaphone','Rss',
  'MapPin','Map','Navigation','Home','Flag',
  'Scissors','Brush','Palette','Sparkles','Wand2',
  'Dumbbell','Apple','Coffee','UtensilsCrossed',
  'Sun','Moon','Cloud','Leaf','Flower2','TreePine',
]

export function searchIcons(query: string, limit = 120): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return SOCIAL_DEFAULTS.filter((n) => n in ICON_MAP).slice(0, limit)
  return ICON_NAMES.filter((n) => n.toLowerCase().includes(q)).slice(0, limit)
}

// --- Emoji ---
export const EMOJI_LIST = [
  '⭐','🔥','💯','✨','🎯','🚀','💡','💎','🏆','🥇','🎉','🙌','👏','💪','❤️','😍','🤩','😊','🙏','🤝',
  '💼','📊','📈','📉','🏢','📝','✅','📌','🔑','💰','💳','🛒','🎁','📦','🚚','📣','📢','🔔','📅',
  '👤','👥','👶','🧑‍💼','👩‍🏫','🧑‍🎓','😄','🥳','🫶',
  '📷','📸','🎥','🎬','🎙️','🎵','🎶','📱','💻','🖥️','📺','🎮','📻',
  '📚','📖','✏️','🖊️','🎓','🏫','🧪','🔬','🔭','💭',
  '🍎','🥗','🏋️','🧘','🏃','❤️‍🔥','🩺','💊','🌿',
  '🌟','🌈','🌺','🌸','🌻','🍃','☀️','🌙','⚡','🌊','🏔️','🌍',
  '📍','🗺️','🏠','🏡','🏪','🏨','🌆','🌃','✈️','🚗','🚢',
  '☕','🍕','🍔','🎂','🍷','🥂','🍽️','👨‍🍳',
  '🎨','🖌️','🖍️','🎭','🎪','🛍️','👗','💍','💄',
]

// --- Simple Icons (marcas) ---
export type SimpleIconEntry = { key: string; title: string; hex: string; path: string }

const SI_CATALOG: SimpleIconEntry[] = [
  // Redes sociais
  { key: 'siInstagram',    ...siInstagram },
  { key: 'siFacebook',     ...siFacebook },
  { key: 'siWhatsapp',     ...siWhatsapp },
  { key: 'siYoutube',      ...siYoutube },
  { key: 'siTiktok',       ...siTiktok },
  { key: 'siX',            ...siX },
  { key: 'siLinkedin',     ...siLinkedin },
  { key: 'siPinterest',    ...siPinterest },
  { key: 'siTelegram',     ...siTelegram },
  { key: 'siSnapchat',     ...siSnapchat },
  { key: 'siDiscord',      ...siDiscord },
  { key: 'siTwitch',       ...siTwitch },
  // Produtividade / design
  { key: 'siNotion',       ...siNotion },
  { key: 'siSlack',        ...siSlack },
  { key: 'siZoom',         ...siZoom },
  { key: 'siCanva',        ...siCanva },
  { key: 'siFigma',        ...siFigma },
  { key: 'siAdobe',        ...siAdobe },
  { key: 'siBehance',      ...siBehance },
  { key: 'siDribbble',     ...siDribbble },
  { key: 'siGithub',       ...siGithub },
  { key: 'siWordpress',    ...siWordpress },
  // Grandes marcas
  { key: 'siGoogle',       ...siGoogle },
  { key: 'siApple',        ...siApple },
  { key: 'siAmazon',       ...siAmazon },
  { key: 'siSpotify',      ...siSpotify },
  { key: 'siNetflix',      ...siNetflix },
  { key: 'siGooglemaps',   ...siGooglemaps },
  { key: 'siGoogleplay',   ...siGoogleplay },
  { key: 'siAppstore',     ...siAppstore },
  // E-commerce / pagamento
  { key: 'siShopify',      ...siShopify },
  { key: 'siStripe',       ...siStripe },
  { key: 'siPaypal',       ...siPaypal },
  { key: 'siMercadopago',  ...siMercadopago },
  { key: 'siVisa',         ...siVisa },
  { key: 'siMastercard',   ...siMastercard },
  // Delivery / viagem
  { key: 'siUber',         ...siUber },
  { key: 'siIfood',        ...siIfood },
  { key: 'siAirbnb',       ...siAirbnb },
  { key: 'siTripadvisor',  ...siTripadvisor },
]

// Map keyed for O(1) lookup in renderer
const SI_MAP = new Map(SI_CATALOG.map((e) => [e.key, e]))

export function getSimpleIcon(key: string): SimpleIconEntry | null {
  return SI_MAP.get(key) ?? null
}

export function searchSimpleIcons(query: string): SimpleIconEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return SI_CATALOG
  return SI_CATALOG.filter((e) => e.title.toLowerCase().includes(q) || e.key.toLowerCase().includes(q))
}

// --- Símbolos Unicode ---
export const SYMBOL_LIST = [
  // Geométricos
  '★','☆','●','○','■','□','▲','△','◆','◇','❤','♡','✦','✧','✺','✹','✸','✶','✵','✴',
  // Decorativos
  '✿','❀','❁','✾','❃','✻','✼','❋','✽','⊕','⊗','⊘','⊙','⊚','⊛',
  // Marcadores / UI
  '✓','✗','✘','✔','✕','✖','⊞','⊟','⊠','⊡',
  // Setas estilizadas
  '➤','➢','➣','➥','➦','➧','➨','➭','➮','➯','➱','➲','➳','➵','➸','➺','➻','➼','➽','➾',
  // Formas
  '⬟','⬡','⬢','⬣','⬤','⬥','⬦','⬧','⬨','⬩','⬪','⬫','⬬','⬭',
  // Símbolos especiais
  '∞','©','®','™','§','¶','†','‡','‰','‱','№','℃','℉','Ω','μ','π','Σ','√','∑',
  // Flores / ornamentos
  '✱','✲','✳','✴','✵','✶','✷','✸','✹','✺','❊','❉','❈','❇','❆','❅','❄','❃',
]
