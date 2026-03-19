import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type = 'website', url, image, noindex }) => {
  const siteTitle = 'Emergency QR - Access Life-Saving Info Instantly';
  const defaultDescription = 'Emergency QR enables immediate access to vital medical profiles during emergencies, providing rapid and accessible health care communication when it matters most.';
  
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name='description' content={description || defaultDescription} />
      
      {/* Conditionally add noindex/nofollow tags */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph Tags */}
      {type && <meta property="og:type" content={type} />}
      {title && <meta property="og:title" content={title} />}
      <meta property="og:description" content={description || defaultDescription} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      {name && <meta property="og:site_name" content={name} />}

      {/* Twitter Tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      {title && <meta name="twitter:title" content={title} />}
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
