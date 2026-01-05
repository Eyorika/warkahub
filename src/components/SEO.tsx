import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

const SEO = ({
    title,
    description = "Connect with Ethiopia's best caterers, decorators, photographers, and event professionals. All verified, all in one place.",
    keywords = "Ethiopia, Event, Booking, Vendor, Catering, Wedding, Party, WarkaHub",
    image = "/og-image.jpg",
    url = "https://warkahub.com"
}: SEOProps) => {
    const siteTitle = "WarkaHub - Ethiopia's Event Planning Hub";
    const fullTitle = title ? `${title} | WarkaHub` : siteTitle;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
