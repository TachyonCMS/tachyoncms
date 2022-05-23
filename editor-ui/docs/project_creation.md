# Creating TachyonCMS Electron App

## Clone project

`git clone git@github.com:TachyonCMS/desktop-editor.git`

## Create Quasar project in project

```bash
yarn create quasar
```

```bash
 .d88888b.
d88P" "Y88b
888     888
888     888 888  888  8888b.  .d8888b   8888b.  888d888
888     888 888  888     "88b 88K          "88b 888P"
888 Y8b 888 888  888 .d888888 "Y8888b. .d888888 888
Y88b.Y8b88P Y88b 888 888  888      X88 888  888 888
 "Y888888"   "Y88888 "Y888888  88888P' "Y888888 888
       Y8b

✔ What would you like to build? › App with Quasar CLI, let's go!
✔ Project folder: … quasar-project
✔ Pick Quasar version: › Quasar v2 (Vue 3 | latest and greatest)
✔ Pick script type: › Javascript
✔ Pick Quasar App CLI variant: › Quasar App CLI with Webpack (stable)
✔ Package name: … desktop-editor
✔ Project product name: (must start with letter if building mobile apps) … TachyonCMS
✔ Project description: … Manage TachyonCMS files locally, without any backend servers required.
✔ Author: … Brian Winkers <bwinkers@gmail.com>
✔ Pick your CSS preprocessor: › Sass with SCSS syntax
✔ Check the features needed for your project: › ESLint
✔ Pick an ESLint preset: › Prettier
✔ Install project dependencies? (recommended) › Yes, use yarn
```

Copy the new Quasar files into the repo directory.

```bash
cp -r ./quasar-project/. ./desktop-editor
```

## Test app

```bash
quasar dev
```

## Connect to Git repo

```bash
git init
git branch -m main
git remote add origin git@github.com:TachyonCMS/desktop-editor.git
git branch --set-upstream-to=origin/main main
git pull origin main
```
