<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root {
            color-scheme: light;
            --bg: #f8f5ee;
            --surface: #ffffff;
            --ink: #18211d;
            --muted: #5f6c63;
            --brand: #15372c;
            --teal: #1f7a8c;
            --accent: #c9552a;
            --line: #ded7c8;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--bg);
            color: var(--ink);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.6;
          }
          a { color: inherit; text-decoration: none; }
          a:hover { color: var(--accent); }
          .feed-shell {
            width: min(1080px, calc(100% - 32px));
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
            letter-spacing: 0;
          }
          .feed-hero {
            padding: 34px 0 28px;
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
            font-size: 1.08rem;
          }
          .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 24px;
          }
          .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
            padding: 0 18px;
            border-radius: 8px;
            background: var(--brand);
            color: #fff;
            font-weight: 750;
          }
          .button:hover {
            color: #fff;
            background: var(--accent);
          }
          .button.secondary {
            background: transparent;
            color: var(--brand);
            border: 1px solid var(--line);
          }
          .button.secondary:hover {
            color: var(--accent);
            border-color: var(--accent);
          }
          .feed-list {
            padding: 28px 0 0;
          }
          h2 {
            margin: 0 0 16px;
            color: var(--muted);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .feed-item {
            padding: 22px 0;
            border-top: 1px solid var(--line);
          }
          .feed-item:first-of-type {
            border-top: 0;
          }
          .feed-date {
            margin: 0 0 6px;
            color: var(--teal);
            font-size: 0.82rem;
            font-weight: 750;
          }
          h3 {
            margin: 0;
            font-size: clamp(1.25rem, 3vw, 2rem);
            line-height: 1.15;
            letter-spacing: 0;
          }
          .feed-item p:last-child {
            max-width: 820px;
            margin: 10px 0 0;
            color: var(--muted);
          }
          footer {
            margin-top: 36px;
            padding-top: 22px;
            border-top: 1px solid var(--line);
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
            .feed-shell {
              width: min(100% - 24px, 1080px);
              padding-top: 22px;
            }
            .actions {
              display: grid;
            }
            .button {
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <main class="feed-shell">
          <header class="feed-hero">
            <a class="brand" href="https://www.patelsvine.in/">
              <span class="brand-mark">PV</span>
              <span>PatelsVine</span>
            </a>
            <p class="eyebrow">RSS Feed</p>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
            <div class="actions">
              <a class="button" href="https://www.patelsvine.in/blog/">Read latest posts</a>
              <a class="button secondary" href="https://www.patelsvine.in/rss.xml">Feed XML</a>
            </div>
          </header>
          <section class="feed-list">
            <h2>Latest Posts</h2>
            <xsl:for-each select="/rss/channel/item">
              <article class="feed-item">
                <p class="feed-date"><xsl:value-of select="pubDate"/></p>
                <h3>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h3>
                <p><xsl:value-of select="description"/></p>
              </article>
            </xsl:for-each>
          </section>
          <footer>
            Subscribe in any feed reader with <code>https://www.patelsvine.in/rss.xml</code>.
          </footer>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>