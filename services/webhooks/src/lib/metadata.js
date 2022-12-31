// This works around Shopify's inconsistent metadata key naming.
const getMetadataValue = (metadata, searchKey) => {
  return metadata[
    Object.keys(metadata).find(
      (key) => key.toLowerCase() === searchKey.toLowerCase()
    )
  ];
};

module.exports = {
  getMetadataValue
};
