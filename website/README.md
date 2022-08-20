# Front End
This is the front-facing website for the Politicry application. It's a Nuxt.js application and can be statically built or run with server-side rendering (SSR).

## Build Setup

**Development**
```bash
yarn dev
```

**SSR with Docker (preferred)**

To build and run for node.js serving with SSR, as a Docker container. As this is intended to sit alongside the Politicry API, this is the preferred approach as it can be easily combined with docker compose.

```bash
docker build . -t front-ui
docker run -p 3000:3000 front-ui
```
