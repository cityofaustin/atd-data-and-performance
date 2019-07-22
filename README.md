# Austin Transportation Data and Performance Hub

This repository houses the City of Austin Transportation Department's Data and Performance Hub, a public website which tracks the department's operational performance and curates access to key datasets.

This site is hosted at [transportation.austintexas.io](http://transportation.austintexas.io) and uses [Jekyll](https://jekyllrb.com/) and [Github Pages](https://pages.github.com/) to create static pages.

Much of the content on the site is generated in-browser using [D3js](http://d3js.org) and [jQuery](https://jquery.com/) to visualize data from the [City of Austin Open Data Portal](http://data.austintexas.gov).

## Quick Start

1.  Install [Git](https://git-scm.com/) and [Jekyll](https://jekyllrb.com/).

    - You may need to install Bundler v2. Do that with the command `gem install bundler` then `bundle install` to update your gems. Go [here](https://bundler.io/v2.0/guides/bundler_2_upgrade.html#what-happens-if-my-application-needs-bundler-2-but-i-only-have-bundler-1-installed) for more info.

2.  `cd` to the directory where you want to check-out the site, and clone it (`git clone https://github.com/cityofaustin/transportation`)

3.  `cd` to the directory that contains the cloned repository, and run `jekyll serve` to start the webserver

4.  Navigate to http://localhost:4000 in your browser to view the site hosted-locally

### Optional Advanced Javascript

If you will be working on any data dashboards that utilize Javascript ES6+ and/or React.js, we have a build setup for transpiling modern JS into a cross-compatible bundle.

1.  run `npm install` to download and install javascript dependencies from package.json

2.  run `webpack --watch`. As files are modified, a new bundle will be automatically generated.

3.  (optional) Inspect webpack.config.js and create a new entry to start a new bundle.

#### TL;DR

1. run `jekyll serve --watch` in one Terminal 
2. run `webpack --watch` in a separate Terminal

Webpack will watch for changes to your source javascript/react files and output a new bundle. Jekyll will watch for new bundles and regenerate all the static assets.

## Environments

### Production

- **URL:** [transportation.austintexas.io](http://transportation.austintexas.io)

- **GitHub:** `gh-pages`

- **Deployment:** Commit changes to branch `test` and submit a pull request to merge to gh-pages

## Contributing

Public contributions are welcome! Assign pull requests to [@johnclary](http://github.com/johnclary).
