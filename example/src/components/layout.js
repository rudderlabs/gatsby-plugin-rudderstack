import React from "react"
import { Link } from "gatsby"

export default function Layout({ children }) {
  return (
    <div style={{ margin: `0 auto`, maxWidth: 650, padding: `0 1rem` }}>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      {children}
    </div>
  )
}
