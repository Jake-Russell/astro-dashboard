import type { MetadataRoute } from "next";

// TODO: Update to Star Grade once setup
const siteUrl = "https://astro-dashboard-six.vercel.app";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
