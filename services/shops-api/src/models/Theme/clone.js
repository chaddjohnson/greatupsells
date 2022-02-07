const models = require('..');

const clone = async (theme) => {
  const Theme = await models.get('Theme');
  const data = theme.toObject();

  delete data.__v;
  delete data._id;
  delete data.offer;

  const clonedTheme = await Theme.create(data);

  return clonedTheme;
};

module.exports = clone;
