const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(1);
  try {
    console.log(2);
    const PopupTheme = await models.get('PopupTheme');
    console.log(3);
    const popupThemes = await PopupTheme.find({
      shop: null,
      offer: null
    }).sort({ displayOrder: 1 });
    console.log(4);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(popupThemes)
    };
  } catch (error) {
    console.log(5);
    console.log(error);
    await logger.error(`Error retrieving popup themes`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
