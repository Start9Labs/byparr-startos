<p align="center">
  <img src="icon.svg" alt="Byparr Logo" width="21%">
</p>

# Byparr on StartOS

> Everything not listed in this document should behave the same as upstream Byparr.
> If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation section of
> `instructions.md` for links.

[Byparr](https://github.com/ThePhaseless/Byparr) is a FlareSolverr-compatible API that opens a page in a hardened headless Firefox, gets past a Cloudflare or similar anti-bot challenge, and returns the cookies, user agent and page. This package runs it unconfigured apart from an optional outbound proxy, for Prowlarr on the same server to use as its FlareSolverr indexer proxy.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The package runs upstream's own image unmodified, with its entrypoint (`tini` → `python main.py`) and `tini` as PID 1.

| Property      | Value                                  |
| ------------- | -------------------------------------- |
| Image         | `ghcr.io/thephaseless/byparr`          |
| Architectures | x86_64, aarch64                        |
| Entrypoint    | upstream default, as UID 1000          |
| Subcontainer  | `byparr-sub`, running daemon `primary` |

The browser and its add-ons are baked into the image under `/cache`.

Before the daemon, a oneshot `chown-geoip` runs as root in the same subcontainer and hands the GeoIP mount to UID 1000, since the volume directory is created root-owned.

## Volume and Data Layout

One volume, `main`:

| Path in volume | Mounted at                          | Holds                                                                   |
| -------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| `store.json`   | not mounted                         | the package's proxy settings                                            |
| `geoip/`       | `/cache/invisible-playwright/geoip` | the GeoIP database Byparr downloads (about 115 MB), one dated directory |

Byparr keeps no other state; each request uses a throwaway browser profile under `/tmp` in the container's own filesystem.

## File Models

One file, the package's `store.json` (JSON, at the root of `main`). No Byparr configuration is written to disk; the package configures Byparr through environment variables, which Byparr reads on every start.

| Key             | Written by                  | Delivered as     |
| --------------- | --------------------------- | ---------------- |
| `proxyServer`   | Configure Residential Proxy | `PROXY_SERVER`   |
| `proxyUsername` | Configure Residential Proxy | `PROXY_USERNAME` |
| `proxyPassword` | Configure Residential Proxy | `PROXY_PASSWORD` |

A variable is set only when its value is non-empty, and the username and password only alongside a server. `PORT=8191` is always set. `store.json` is read reactively, so saving the action restarts Byparr.

## Dependencies

None. Prowlarr declares Byparr as an optional dependency of its own when Byparr is selected in Prowlarr's **Connect Apps**, and creates its FlareSolverr indexer proxy pointing at Byparr's bridge address.

## Network Access and Interfaces

One HTTP interface on host `api`, port 8191.

| Interface | Id    | Type  | Port | Purpose                                                                  |
| --------- | ----- | ----- | ---- | ------------------------------------------------------------------------ |
| API       | `api` | `api` | 8191 | `POST /v1` (FlareSolverr protocol), `POST /load`, `GET /health`, `/docs` |

The API has no authentication, and every request makes the server open a browser to any URL the caller names. Other services reach it on its bridge address (`http://10.0.3.1:8191` when the preferred port was free).

## Installation and First-Run Flow

Nothing to set up: the service starts with no proxy. The `geoip/` mount preserves the location database across restarts; upstream checks it against GitHub (`daijro/geoip-all-in-one`) during startup and downloads it when missing or outdated, before opening the API port. Without a proxy, startup also discovers the public IP through `api.ipify.org`, `icanhazip.com` or `checkip.amazonaws.com` and resolves the browser timezone and locale once per process. Successful lookups remain cached until restart; proxied requests still discover the proxy's public IP on each request. Every `/v1` request launches a fresh browser.

Startup can take several minutes on a slow or unreachable network. Failed lookups are retried on later requests: the public IP after ten minutes, and the database initially after thirty seconds with exponential backoff up to ten minutes. Direct connections fall back to the host timezone and `en-US`; proxied requests need the database to resolve their timezone and fail while it is unavailable.

## Actions

One user-facing action, which may run while Byparr is running or stopped.

- **Configure Residential Proxy** (`configure-proxy`) — run when the user has bought an HTTP or SOCKS5 proxy, usually a residential one, to change the address websites see. It writes the three `proxy*` keys in `store.json`; clearing the server clears the username and password too. Saving restarts Byparr, including its startup location checks. Idempotent. With a proxy set that cannot be reached, every `/v1` request fails with HTTP 500 and a `GeoTimezoneError` ("could not discover the proxy egress IP") in the service log; clearing the server or fixing the address resolves it.

A proxy changes only the address Byparr's browser appears from. Prowlarr retries the challenged request itself with Byparr's cookies, and Cloudflare accepts them only from the solving address, so Prowlarr must use the same proxy (its **Settings → General → Proxy**), or, without a proxy, the same outbound gateway as Byparr. `instructions.md` gives the user the three supported setups. Indexers that fail while Byparr reports `Success` in its log are almost always this mismatch.

## Tasks

None. The service is never held on a prompt.

## Health Checks

One check, `primary` ("API"), that passes once port 8191 is listening. It does not use upstream's `/health`, which launches a browser and loads google.com on every call. A green check therefore says the server is up, not that challenges are being solved; for that, read the log for `Done <url>` lines and their timings, or a failure. A red check during startup can mean the location database or public-IP lookup is still pending; the log distinguishes this from a Python server crash.

## Backups and Restore

The `main` volume is copied (`ofVolumes`) with `geoip/` excluded, so the backup is just `store.json` and a restore brings back the proxy settings. The GeoIP database is downloaded again during startup after a restore.

## Limitations and Differences

Upstream options the package leaves unset, where it runs Byparr differently from upstream, and what it cannot guarantee.

1. No setting for upstream's `OWUI_API_KEY`, so the `/load` endpoint for Open WebUI is unauthenticated.
2. No `BROWSER_LOCALE` or `BROWSER_TIMEZONE` settings, so the browser's language and timezone follow the country of Byparr's public IP. Direct-connection results remain cached until restart; lookup failures fall back to the host timezone and `en-US`.
3. No `LOG_LEVEL` setting; logs are at upstream's default, `INFO`.
4. No tmpfs for `/tmp`; upstream's suggestion to put `/cache` on a tmpfs would hide the browser baked into the image.
5. Getting past a challenge is likely, not guaranteed: Cloudflare also weighs the reputation of the address the browser appears from.

---

## Quick Reference for AI Consumers

```yaml
package_id: byparr
image: ghcr.io/thephaseless/byparr
architectures: [x86_64, aarch64]
subcontainers: [byparr-sub]
volumes:
  main: /cache/invisible-playwright/geoip (subpath geoip)
file_models:
  - main/store.json
startos_managed_env_vars:
  - PORT
  - PROXY_SERVER
  - PROXY_USERNAME
  - PROXY_PASSWORD
dependencies: none
interfaces:
  api: { type: api, port: 8191 }
actions:
  - configure-proxy
tasks: none
health_checks:
  - primary
```
