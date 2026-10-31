import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'byparr',
  title: 'Byparr',
  license: 'GPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/byparr-startos',
  upstreamRepo: 'https://github.com/ThePhaseless/Byparr',
  marketingUrl: 'https://github.com/ThePhaseless/Byparr',
  donationUrl: 'https://github.com/sponsors/ThePhaseless',
  description: { short, long },
  volumes: ['main'],
  images: {
    byparr: {
      source: { dockerTag: 'ghcr.io/thephaseless/byparr:3.0.4' },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
