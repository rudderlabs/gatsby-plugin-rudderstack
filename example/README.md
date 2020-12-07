# An Example Gatsby Website with Rudderstack

This is an example website for using the gatsby rudderstack analytics plugin.

## How to Use

**To the Rudderstack team** First, since the plugin isn't published on NPM/Yarn yet you need to link the plugin to your node_modules folder.

### To Link the Plugin

- In the gatsby-plugin-rudderstack directory, run npm link.
- Then, `cd /example` to move into this directory.
- Then, run `npm link "gatsby-plugin-rudderstack"`
  This will create a symlink to the above directory from your node_modules directory to test the plugin before we publish it.

### Then, to run the Gatsby Website

- Make sure to edit the gatsby-config.js file configuration. (Add your write key.)

Then, in your terminal in this directory:

- `npm install` or `yarn`
- `gatsby develop`
