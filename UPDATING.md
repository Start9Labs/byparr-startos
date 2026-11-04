# Updating the upstream version

Upstream is the image Byparr publishes to GHCR, pinned by tag in `startos/manifest/index.ts` (`images.byparr.source.dockerTag`).

## Determining the upstream version

Byparr releases are `v`-prefixed git tags; the image tags drop the `v`. The latest release:

```bash
gh release view -R ThePhaseless/Byparr --json tagName -q .tagName
```

Ignore the `main` and `pr-*` image tags — those are untested builds.

## Applying the bump

1. Confirm the tag carries both architectures: `docker manifest inspect ghcr.io/thephaseless/byparr:<version> | jq -r '.manifests[].platform.architecture'`.
2. Set `dockerTag` to `ghcr.io/thephaseless/byparr:<version>`.
3. Check upstream's README for renamed or removed environment variables: the package sets `PORT` and the `PROXY_*` variables in `startos/main.ts`.
4. Confirm the GeoIP database still lives at `geoipDir` (`startos/utils.ts`), where `startos/main.ts` mounts the volume's `geoip` subpath. If it moves, nothing fails, but the database downloads again after every restart. This must print `/cache/invisible-playwright/geoip`:

   ```bash
   docker run --rm --entrypoint /app/.venv/bin/python ghcr.io/thephaseless/byparr:<version> -c 'from invisible_core._geoip_db import _geoip_root; print(_geoip_root())'
   ```
