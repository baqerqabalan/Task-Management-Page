import React from "react";

export default function Layout({ children }) {
  return (
    <html style={{ height: "100%", margin: 0 }}>
      <body style={{ height: "100%", margin: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  );
}
