/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-rudderstack",
      options: {
        prodKey: `YOUR_WRITE_KEY_HERE`,
        devKey: `YOUR_WRITE_KEY_HERE`,
        trackPage: true,
      },
    },
  ],
}
