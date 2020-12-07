<p align="center"><a href="https://rudderstack.com"><img src="https://raw.githubusercontent.com/rudderlabs/rudder-server/master/resources/RudderStack.png" alt="RudderStack - An Open Source Customer Data Platform" height="90"/></a></p>
<h1 align="center">gatsby-plugin-rudderstack</h1>
<p align="center"><b>The warehouse-first customer data platform built for devs</b></p>
<br/>

# The Rudderstack Plugin for Gatsby

This is a way for you to quickly and easily get Rudderstack up and running in your Gatsby application.

Questions? Please join our [Slack channel](https://resources.rudderstack.com/join-rudderstack-slack) or read about us on [Product Hunt](https://www.producthunt.com/posts/rudderstack).

# Why Use this plugin

This plugin makes it easy to integrate your Gatsby website with the Rudderstack API and easily track events.

# Key Features

- use multiple write keys (one for prod env, another optional one for dev)
- disable page view tracking (just in case you want to add it later manually)
- up to date (Rudderstack team maintained)

## Install

- NPM: `$ npm install --save gatsby-plugin-rudderstack`
- YARN: `$ yarn add gatsby-plugin-rudderstack`

## How to use

### Setup

In your gatsby-config.js file:

```javascript
plugins: [
  {
    resolve: `gatsby-plugin-rudderstack`,
    options: {
      // your rudderstack write key for your production environment
      // when process.env.NODE_ENV === 'production'
      // required; non-empty string
      prodKey: `RUDDERSTACK_PRODUCTION_WRITE_KEY`,

      // if you have a development env for your rudderstack account, paste that key here
      // when process.env.NODE_ENV === 'development'
      // optional; non-empty string
      devKey: `RUDDERSTACK_DEV_WRITE_KEY`,

      // boolean (defaults to false) on whether you want
      // to include analytics.page() automatically
      // if false, see below on how to track pageviews manually
      trackPage: false,

      // number (defaults to 50); time to wait after a route update before it should
      // track the page change, to implement this, make sure your `trackPage` property is set to `true`
      trackPageDelay: 50,

      // If you need to proxy events through a custom endpoint,
      // add a `host` property (defaults to https://hosted.rudderlabs.com )
      // Rudderstack docs:
      //   - https://docs.rudderstack.com/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk#2-1-minified-code
      host: `https://override-rudderstack-endpoint`,

      // boolean (defaults to false); whether to delay load Rudderstack
      // ADVANCED FEATURE: only use if you leverage client-side routing (ie, Gatsby <Link>)
      // This feature will force Rudderstack to load _after_ either a page routing change
      // or user scroll, whichever comes first. This delay time is controlled by
      // `delayLoadTime` setting. This feature is used to help improve your website's
      // TTI (for SEO, UX, etc).  See links below for more info.
      // NOTE: But if you are using server-side routing and enable this feature,
      // Rudderstack will never load (because although client-side routing does not do
      // a full page refresh, server-side routing does, thereby preventing Rudderstack
      // from ever loading).
      // See here for more context:
      // GIF: https://github.com/benjaminhoffman/gatsby-plugin-segment/pull/19#issuecomment-559569483
      // TTI: https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md#performance
      // Problem/solution: https://marketingexamples.com/seo/performance
      delayLoad: false,

      // number (default to 1000); time to wait after scroll or route change
      // To be used when `delayLoad` is set to `true`
      delayLoadTime: 1000

      // Whether to completely skip calling `analytics.load()`.
      // ADVANCED FEATURE: only use if you are calling `analytics.load()` manually
      // elsewhere in your code or are using a library
      // like: https://github.com/Rudderstackio/consent-manager that will call it for you.
      // Useful for only loading the tracking script once a user has opted in to being tracked, for example.
      manualLoad: false
    }
  }
];
```

### Track Events

If you want to track events, you simply invoke Rudderstack as normal in your React components — (`window.rudderanalytics.track('Event Name', {...})` — and you should see the events within your Rudderstack debugger! For example, if you wanted to track events on a click, it may look something like this:

```javascript
class IndexPage extends React.Component {
    ...
    _handleClick() {
        window.rudderanalytics.track("Track Event Fired", {
            userId: user.id,
            gender: 'male',
            age: 33,
        });
    }
    render() {
        return (
            <p>
                <Link onClick={this._handleClick} to="/">
                    Click here
                </Link>{" "}
                to see a track event
            </p>
        );
    }
}
```

### Track Pageviews

If you want to track pageviews automatically, set `trackPage` to `true` in your `gatsby-config.js` file. What we mean by _"automatically"_ is that whenever there is a route change, we leverage Gatsby's `onRouteUpdate` API in the `gatsby-browser.js` file ([link](https://www.gatsbyjs.org/docs/browser-apis/#onRouteUpdate)) to invoke `window.rudderanalytics.page()` on each route change. But if you want to pass in properties along with the pageview call (ie, it's common to see folks pass in some user or account data with each page call), then you'll have to set `trackPage: false` and call it yourself in your `gatsby-browser.js` file, like this:

```javascript
// gatsby-browser.js
exports.onRouteUpdate = () => {
  window.rudderanalytics && window.rudderanalytics.page();
};
```

# License

RudderStack **gatsby-plugin-rudderstack** is released under the [AGPLv3 License][agplv3_license].

# Contribute

We would love to see you contribute to RudderStack. Get more information on how to contribute [here](CONTRIBUTING.md).

# Follow Us

- [RudderStack Blog][rudderstack-blog]
- [Slack][slack]
- [Twitter][twitter]
- [LinkedIn][linkedin]
- [dev.to][devto]
- [Medium][medium]
- [YouTube][youtube]
- [HackerNews][hackernews]
- [Product Hunt][producthunt]

# :clap: Our Supporters

[![Stargazers repo roster for @rudderlabs/rudder-server](https://reporoster.com/stars/rudderlabs/gatsby-plugin-rudderstack)](https://github.com/rudderlabs/gatsby-plugin-rudderstack/stargazers)
[![Forkers repo roster for @rudderlabs/rudder-server](https://reporoster.com/forks/rudderlabs/gatsby-plugin-rudderstack)](https://github.com/rudderlabs/gatsby-plugin-rudderstack/network/members)

<!----variables---->

[slack]: https://resources.rudderstack.com/join-rudderstack-slack
[twitter]: https://twitter.com/rudderstack
[linkedin]: https://www.linkedin.com/company/rudderlabs/
[devto]: https://dev.to/rudderstack
[medium]: https://rudderstack.medium.com/
[youtube]: https://www.youtube.com/channel/UCgV-B77bV_-LOmKYHw8jvBw
[rudderstack-blog]: https://rudderstack.com/blog/
[hackernews]: https://news.ycombinator.com/item?id=21081756
[producthunt]: https://www.producthunt.com/posts/rudderstack
[agplv3_license]: https://www.gnu.org/licenses/agpl-3.0-standalone.html
[sspl_license]: https://www.mongodb.com/licensing/server-side-public-license
[config-generator]: https://github.com/rudderlabs/config-generator
[config-generator-section]: https://github.com/rudderlabs/rudder-server/blob/master/README.md#rudderstack-config-generator
[rudder-logo]: https://repository-images.githubusercontent.com/197743848/b352c900-dbc8-11e9-9d45-4deb9274101f
