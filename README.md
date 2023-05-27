## Setup

```sh
npm i -g yo
git clone https://github.com/morten-olsen/generators
cd generators
pnpm bootstrap
```

## Commands

* `yo x-repo [location]`: Creates a new mono repo
* `yo x-pkg [location]`: Creates a new package in a mono repo
* `yo x-git [location]`: Initializes Git and creates the repo on GitHub (Needs `GITHUB_TOKEN` or `GH_TOKEN` env variable)
* `yo x-npm [location]`: Sets up NPM publishing as a GitHub action (`GITHUB_TOKEN`/`GH_TOKEN` is needed to auto create GitHub secrets)