# Deployment, Interim Hosting, and Transfer

The build output of this dashboard is a folder of static files (`dist/`). That single fact drives the whole hosting story: the same artifact runs on a free demo host today, on the Rwanda Forestry Authority's hosting arrangement tomorrow, and on whatever the Kigali dashboard roadmap decides later, without rework.

## Hosting reality in Rwanda, and why this architecture fits it

Government of Rwanda ICT directives, grounded in the March 2012 ministerial instructions (Articles 16 and 17), require government websites and IT systems to be hosted at the National Data Center (NDC), with hosting procured through the established framework and RISA guidance. RFA already complies: both the RFA website and FMES (`fmes.rfa.rw`) are served from national infrastructure.

This dashboard was designed for that destination:

- **No server runtime.** A static folder served by any web server. Nothing to license, patch, or administer beyond the web server RFA already runs.
- **No database.** Data lives in version-controlled files inside the artifact.
- **No external dependencies at runtime** except OpenStreetMap tiles, which are free and keyless.
- **Docker option.** For NDC virtual machines, `docker build` produces a self-contained nginx image (~50 MB) with hardening headers and caching preconfigured.

A natural interim arrangement is a subdomain under RFA's existing setup, for example `nbs.rfa.rw`, sitting beside `fmes.rfa.rw` on the same infrastructure. Co-locating the public communication layer with the system of record also makes the future FMES data exchange an internal hop rather than a cross-boundary integration.

## Deployment paths

### 1. Demo hosting during development (now, zero cost)

The prototype deploys to a free static host (currently Vercel) for stakeholder review during the proposal and build phases. This costs nothing and requires no RFA resources before handover.

### 2. RFA interim hosting at the NDC (at handover)

Two equivalent options, chosen with RFA's technical team:

- **Static files.** Copy `dist/` to any web server (nginx, Apache, IIS). The provided `nginx.conf` documents routing, caching, and hardening headers.
- **Container.** `docker build -t kigali-nbs-dashboard . && docker run -p 80:80 kigali-nbs-dashboard`. Suitable for NDC virtual machines and any container platform.

Rebuilds (after content edits) run `npm ci && npm run build` on any machine with Node 22, or through the included GitHub Actions workflow which validates data, runs tests, builds, and produces the deployable artifact automatically.

### 3. Transfer to a future host (post-MVP)

Whatever governance decides (RFA long-term, City of Kigali, or a successor platform), transfer is:

1. Hand over the repository (full history, documentation, and data).
2. Point the build pipeline or a manual build at the new host.
3. Move the DNS record.

No vendor participation is required. There is no platform to migrate off, because there is no platform.

## Portability proof

The same `dist/` artifact is verified on multiple hosts (demo host and local nginx container) with zero configuration differences beyond the web server itself. Anyone can reproduce this:

```bash
npm ci && npm run build          # produces dist/
npx serve dist                   # host it with any static server
docker build -t dashboard . && docker run -p 8080:80 dashboard
```

## Ongoing costs after handover

| Item | Cost |
| --- | --- |
| Software licences | None. All components are open source |
| Database | None exists |
| Map tiles | None. OpenStreetMap, keyless |
| Hosting | Whatever RFA's existing NDC arrangement charges for a static site, effectively marginal |
| Rebuilds | A few minutes of compute per content update, free on public CI |

## Security posture

Read-only public site. No authentication, no personal data, no server-side code, no credentials stored anywhere in the artifact. The demonstration editing screen at `/admin` is static HTML with saving turned off. The optional git-backed editor at `/git-editor` authenticates against GitHub with a personal access token, not against the dashboard, so the public site has no attack surface beyond static file serving. Hardening headers ship in both `nginx.conf` and `vercel.json`.
