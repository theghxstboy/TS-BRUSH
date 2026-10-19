import type { IconifyIcon } from '@iconify/types'

// Wildcard declarations for individual icon files inside each @iconify-icons/* package
declare module '@iconify-icons/ph/*' { const icon: { default: IconifyIcon }; export = icon }
declare module '@iconify-icons/bi/*' { const icon: { default: IconifyIcon }; export = icon }
declare module '@iconify-icons/tabler/*' { const icon: { default: IconifyIcon }; export = icon }
declare module '@iconify-icons/mdi/*' { const icon: { default: IconifyIcon }; export = icon }
