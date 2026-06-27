import { writeFileSync } from "node:fs";
import { join } from "node:path";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stockmemo.io"
).replace(/\/$/, "");

const pages = [{ path: "/", priority: "1.0", changefreq: "weekly" }];

const lastmod = new Date().toISOString();

const robots = `User-Agent: *
Allow: /
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const publicDir = join(process.cwd(), "public");

writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");
writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf8");

console.log(`Generated SEO files for ${siteUrl}`);
