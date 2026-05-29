<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>PatelsVine Sitemap</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root {
            color-scheme: light;
            --bg: #f8f5ee;
            --ink: #18211d;
            --muted: #5f6c63;
            --brand: #15372c;
            --teal: #1f7a8c;
            --accent: #c9552a;
            --line: #ded7c8;
            --surface: #ffffff;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--bg);
            color: var(--ink);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.55;
          }
          a { color: var(--brand); text-decoration: none; }
          a:hover { color: var(--accent); }
          .shell {
            width: min(1120px, calc(100% - 32px));
            margin: 0 auto;
            padding: 32px 0 48px;
          }
          .brand {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: var(--brand);
            font-weight: 800;
          }
          .brand-mark {
            display: inline-grid;
            place-items: center;
            width: 38px;
            height: 38px;
            border-radius: 8px;
            background: var(--brand);
            color: #fff;
            font-size: 0.9rem;
          }
          .hero {
            padding: 34px 0 26px;
            border-bottom: 1px solid var(--line);
          }
          .eyebrow {
            margin: 32px 0 8px;
            color: var(--teal);
            font-size: 0.78rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          h1 {
            margin: 0;
            font-size: clamp(2rem, 6vw, 4.5rem);
            line-height: 0.95;
            letter-spacing: 0;
          }
          .description {
            max-width: 720px;
            margin: 18px 0 0;
            color: var(--muted);
            font-size: 1.05rem;
          }
          .table-wrap {
            overflow-x: auto;
            margin-top: 28px;
            border: 1px solid var(--line);
            border-radius: 8px;
            background: var(--surface);
          }
          table {
            width: 100%;
            min-width: 760px;
            border-collapse: collapse;
          }
          th, td {
            padding: 14px 16px;
            text-align: left;
            border-bottom: 1px solid var(--line);
            vertical-align: top;
          }
          th {
            color: var(--muted);
            font-size: 0.78rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          tr:last-child td {
            border-bottom: 0;
          }
          td {
            color: var(--muted);
            font-size: 0.95rem;
          }
          td:first-child {
            color: var(--brand);
            font-weight: 700;
          }
          footer {
            margin-top: 24px;
            color: var(--muted);
            font-size: 0.95rem;
          }
          code {
            padding: 3px 6px;
            border-radius: 6px;
            background: #ece6d9;
            color: var(--brand);
          }
          @media (max-width: 640px) {
            .shell {
              width: min(100% - 24px, 1120px);
              padding-top: 22px;
            }
          }
        </style>
      </head>
      <body>
        <main class="shell">
          <header class="hero">
            <a class="brand" href="https://www.patelsvine.in/">
              <span class="brand-mark">PV</span>
              <span>PatelsVine</span>
            </a>
            <p class="eyebrow">XML Sitemap</p>
            <h1>Sitemap</h1>
            <p class="description">A browser-friendly view of the public URLs search engines can crawl on PatelsVine.</p>
          </header>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Last modified</th>
                  <th>Change frequency</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="/sm:urlset/sm:url">
                  <tr>
                    <td>
                      <a>
                        <xsl:attribute name="href"><xsl:value-of select="sm:loc"/></xsl:attribute>
                        <xsl:value-of select="sm:loc"/>
                      </a>
                    </td>
                    <td><xsl:value-of select="sm:lastmod"/></td>
                    <td><xsl:value-of select="sm:changefreq"/></td>
                    <td><xsl:value-of select="sm:priority"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
          <footer>
            Search engines can still read this as normal XML at <code>https://www.patelsvine.in/sitemap.xml</code>.
          </footer>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>