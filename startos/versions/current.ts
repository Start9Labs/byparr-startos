import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.0.4:1',
  releaseNotes: {
    en_US:
      'The Configure Residential Proxy action accepts only http:// and socks5:// proxies.',
    es_ES:
      'La acción «Configurar proxy residencial» solo acepta proxies http:// y socks5://.',
    de_DE:
      'Die Aktion „Residential-Proxy konfigurieren“ akzeptiert nur Proxys mit http:// oder socks5://.',
    pl_PL:
      'Akcja „Skonfiguruj proxy rezydencjalne” przyjmuje tylko proxy http:// i socks5://.',
    fr_FR:
      "L'action « Configurer un proxy résidentiel » n'accepte que les proxys http:// et socks5://.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
