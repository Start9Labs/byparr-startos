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
2. Set `dockerTag` to `ghcr.io/thephaseless/byparr:<version>` and `version` in `startos/versions/current.ts` to `<version>:0`.
3. Check upstream's README for renamed or removed environment variables: the package sets `PORT` and the `PROXY_*` variables in `startos/main.ts`.
