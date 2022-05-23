# TachyonCMS (desktop-editor)

Manage TachyonCMS files locally, without any backend servers required.

## Install Quasar CLI

The Quasar CLI is required to run the hot-loading dev environment or create the production build.

Follow the instructions from Quasar, noting that Node 10 or Node 12 is required. Other versions are known to NOT WORK.
https://v1.quasar.dev/quasar-cli/installation

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

or for Electron

```bash
quasar build -m electron
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).

### Using with the TachyonCMS Storage API
