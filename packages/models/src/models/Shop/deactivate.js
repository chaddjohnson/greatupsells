module.exports = async (shop) => {
  // Flag the shop as inactive.
  shop.active = false;

  // Remove the shop's access token.
  shop.accessToken = null;

  // Record when the uninstall occurred.
  shop.uninstalledAt = Date.now();

  await shop.save();
};
