module.exports = {
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-plugin-rudderstack",
      options: {
        prodKey: `YOUR_WRITE_KEY_HERE`,
        devKey: `YOUR_WRITE_KEY_HERE`,
        trackPage: true,
      },
    },
  ],
};
