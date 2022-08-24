import Head from "next/head";
import PropTypes from "prop-types";

const BASE_SITE_URL = "https://data.mobility.austin.gov";

/**
 * Reusable <head> with meta tags courtesy of https://www.heymeta.com/
 */
const PageHead = ({ description, title, imageUrl, pageRoute }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width" />
      {/* <!-- Google / Search Engine Tags --> */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={imageUrl} />
      {/* <!-- Facebook Meta Tags --> */}
      <meta property="og:url" content={`${BASE_SITE_URL}/${pageRoute}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};

PageHead.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  siteUrl: PropTypes.string,
};

export default PageHead;
