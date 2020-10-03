const importCollections = async (shop) => {
  const shopCollectionCount = await shop.getCollectionCount();

  // Abort import if collections have already been imported.
  if (shopCollectionCount > 1) {
    return;
  }

  // TODO: Enqueue a background worker via SQS.
  // TODO: Ignore or update existing.
  return undefined; // TODO
};

module.exports = importCollections;
