import { Link } from "gatsby";
import * as React from "react";

// styles
const pageStyles = {
  color: "#232129",
  padding: "96px",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};
const headingAccentStyles = {
  color: "#663399",
};
const paragraphStyles = {
  marginBottom: 48,
};
const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
};
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
  listStyleType: "none",
};
const listItemStyles = {
  marginBottom: 12,
  fontWeight: "300",
  letterSpacing: 1,
};
const linkStyles = {
  color: "#8954A8",
};

// data
const links = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "About",
    url: "/about",
  },
];

// markup
const AboutPage = () => {
  return (
    <main style={pageStyles}>
      <title>About Page</title>
      <h1 style={headingStyles}>
        Sweet
        <br />
        <span style={headingAccentStyles}>
          — you just made it to the About page!
        </span>
        <span role="img" aria-label="Party popper emojis">
          🎉🎉🎉
        </span>
      </h1>
      <p style={paragraphStyles}>
        Edit <code style={codeStyles}>src/pages/about.js</code> to see this page
        update in real-time.{" "}
        <span role="img" aria-label="Sunglasses smiley emoji">
          😎
        </span>
      </p>
      <ul style={listStyles}>
        {links.map((link) => (
          <li style={listItemStyles} key={`${link.url}`}>
            <Link style={linkStyles} to={`${link.url}`}>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default AboutPage;
