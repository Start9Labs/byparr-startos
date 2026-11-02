# Byparr

## Documentation

- [Byparr README](https://github.com/ThePhaseless/Byparr/blob/main/README.md) — options, proxy use, and troubleshooting

## What you get on StartOS

- An **API** that Prowlarr, or any app that supports FlareSolverr, sends a request to when a site answers with a Cloudflare challenge. Byparr opens the page in a headless browser, gets past the challenge, and returns the cookies the app needs to retry.
- A **Configure Residential Proxy** action, for sending Byparr's browser through a proxy service.

Byparr has no web interface of its own. Opening the API address in a browser shows its API reference.

## Getting set up

1. Start Byparr.
2. In Prowlarr, run **Connect Apps** and select **Byparr**.
3. In Prowlarr, edit each indexer that fails with a Cloudflare error and add the **byparr** tag. Only tagged indexers go through Byparr.
4. Make sure Byparr and Prowlarr reach the internet from the same address — see below.

Every request Byparr handles first asks a public-address service (ipify, icanhazip or Amazon) for the address it browses from (your server's, or the proxy's if you set one), so it can match its browser's language and timezone to that location. It also checks GitHub for a newer location database. The very first request after install downloads that database, about 115 MB, and takes up to half a minute; after that, requests take a few seconds.

## Byparr and Prowlarr must share a public address

Prowlarr does not hand the whole request to Byparr. It sends Byparr the challenge, takes back the cookies, and then repeats the request itself. Cloudflare only accepts those cookies from the address that solved the challenge, so whatever address Byparr's browser appears from, Prowlarr's own requests must appear from too. If they differ, the indexer keeps failing even though Byparr reports success.

Two settings decide that address, and they stack:

- **The outbound gateway** StartOS uses for each service — your home connection by default, or a VPN or StartTunnel you have added. It carries everything Byparr and Prowlarr send.
- **Byparr's residential proxy**, if you set one. Byparr's browser then connects to the proxy through the outbound gateway, and websites see the proxy's address, not the gateway's.

## Residential proxies and outbound gateways

Both change the address websites see, but they are different things, and Cloudflare treats the addresses they give you very differently.

- **An outbound gateway** is a WireGuard tunnel that StartOS sends a whole service's traffic through, without the service knowing. A commercial VPN gives you an address in a data center, shared with many other customers. A StartTunnel gives you the address of your own server in a data center. Cloudflare knows which addresses belong to data centers and challenges them hardest, so a gateway hides your home address but makes challenges harder to pass.
- **A residential proxy service** is a paid service, usually billed per gigabyte, that relays your requests through addresses internet providers assign to ordinary homes. To Cloudflare those look like regular visitors. It is not a tunnel and cannot be added to StartOS as a gateway. Instead, each app is given the proxy's address and login and sends its own requests to it, which is why both Byparr and Prowlarr have to be set up with it. Some providers obtain these home addresses through apps installed on other people's devices. Check how a provider sources them before you buy.

Whichever you use, the proxy provider or VPN can see which sites Byparr and Prowlarr visit.

## Recommended setups

Pick one:

1. **Your home connection (recommended).** Leave both services on the default outbound gateway and set no proxy. A home connection is the kind of address Cloudflare trusts most, so this solves the most challenges.
2. **A VPN or StartTunnel, to keep your home address private.** Select the same outbound gateway for Byparr and for Prowlarr, and set no proxy. Expect some indexers to fail that work from home, because the address is a data-center one.
3. **A residential proxy service.** Run **Configure Residential Proxy** in Byparr with the proxy's address and login. Then enter the same proxy in Prowlarr under **Settings → General → Proxy**, and turn on **Bypass Proxy for Local Addresses** so Prowlarr still reaches Byparr and your other apps directly. Use the provider's sticky-session address, which keeps one exit address for a while. An address that changes on every request breaks the match between the two apps.

## Using Byparr

### Actions

- **Configure Residential Proxy** — sets the proxy server, as `http://`, `https://` or `socks5://` followed by host and port, plus an optional username and password. Clear the server field to connect directly again. Byparr restarts when you save. While a proxy is set and unreachable, every request Byparr receives fails.
