import { useEffect } from "react";
import { Helmet } from "react-helmet-async";


export default function SEO({
    title,
    desc,
    url,
    image,
    type = 'website',
    locale = 'en_US',
    siteName = 'Bekarih',
}) {

    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <Helmet prioritizeSeoTags>
            <title>{title}</title>
            <meta name="description" content={desc} />
            <link rel="canonical" href={url} />

            {/* Open Graph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={desc} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:locale" content={locale} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    )
}