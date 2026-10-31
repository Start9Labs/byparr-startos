import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  proxyServer: Value.text({
    name: i18n('Proxy Server'),
    description: i18n(
      "The proxy Byparr's browser connects through, as protocol://host:port. Leave empty to connect directly.",
    ),
    required: false,
    default: null,
    placeholder: 'http://proxy.example.com:8080',
    patterns: [
      {
        regex: '^(https?|socks5)://[^\\s/:]+:[0-9]+$',
        description: i18n(
          'Must be http://, https:// or socks5:// followed by host:port',
        ),
      },
    ],
  }),
  proxyUsername: Value.text({
    name: i18n('Username'),
    description: i18n('Leave empty if the proxy needs no authentication.'),
    required: false,
    default: null,
  }),
  proxyPassword: Value.text({
    name: i18n('Password'),
    description: i18n('Leave empty if the proxy needs no authentication.'),
    required: false,
    default: null,
    masked: true,
  }),
})

export const configureProxy = sdk.Action.withInput(
  'configure-proxy',
  async () => ({
    name: i18n('Configure Residential Proxy'),
    description: i18n(
      "Send Byparr's browser through an HTTP or SOCKS proxy, such as a residential proxy service. Saving restarts Byparr.",
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  inputSpec,
  async () => {
    const store = await storeJson.read().once()
    return {
      proxyServer: store?.proxyServer ?? null,
      proxyUsername: store?.proxyUsername ?? null,
      proxyPassword: store?.proxyPassword ?? null,
    }
  },
  async ({ effects, input }) =>
    storeJson.merge(effects, {
      proxyServer: input.proxyServer,
      proxyUsername: input.proxyServer ? input.proxyUsername : null,
      proxyPassword: input.proxyServer ? input.proxyPassword : null,
    }),
)
