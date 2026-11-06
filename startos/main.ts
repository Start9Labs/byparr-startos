import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { apiPort, geoipDir } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Byparr!'))

  const proxy = await storeJson.read().const(effects)

  const sub = await sdk.SubContainer.of(
    effects,
    { imageId: 'byparr' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: 'geoip',
      mountpoint: geoipDir,
      readonly: false,
    }),
    'byparr-sub',
  )

  return sdk.Daemons.of(effects)
    .addOneshot('chown-geoip', {
      subcontainer: sub,
      exec: { command: ['chown', '-R', '1000:1000', geoipDir], user: 'root' },
      requires: [],
    })
    .addDaemon('primary', {
      subcontainer: sub,
      exec: {
        command: sdk.useEntrypoint(),
        runAsInit: true,
        env: {
          PORT: String(apiPort),
          ...(proxy?.proxyServer && {
            PROXY_SERVER: proxy.proxyServer,
            ...(proxy.proxyUsername && { PROXY_USERNAME: proxy.proxyUsername }),
            ...(proxy.proxyPassword && { PROXY_PASSWORD: proxy.proxyPassword }),
          }),
        },
      },
      ready: {
        display: i18n('API'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, apiPort, {
            successMessage: i18n('The API is ready'),
            errorMessage: i18n('The API is not ready'),
          }),
        gracePeriod: 300_000,
      },
      requires: ['chown-geoip'],
    })
})
