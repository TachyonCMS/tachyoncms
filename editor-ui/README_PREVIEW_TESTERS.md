# Electron Early Preview Test Instructions

## Ensure you have the correct Node version

Node 10 OR Node 12 is required, earlier or later versions will fail strangely.

## Install Quasar CLI

```bash
yarn global add @quasar/cli
```

Additional help is available here.
https://v1.quasar.dev/quasar-cli/installation

## Get the code

```bash
git clone git@github.com:TachyonCMS/desktop-editor.git
```

## Checkout the latest stable release

```bash
git checkout latest
```

## Run the code

```bash
quasar dev -m electron
```

## Build the code

This will result in a `./dist/electron/TachyonCMS-linux-x64` directory.
Inside that is a `TachyonCMS` executable that you can click on to start the production Electron version.

```bash
quasar build -m electron
```
