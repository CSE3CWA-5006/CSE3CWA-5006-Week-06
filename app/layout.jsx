/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import "./styles.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Folio",
  description: "A refined personal work manager."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
