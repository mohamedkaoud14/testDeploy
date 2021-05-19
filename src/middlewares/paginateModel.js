const paginateMode = (model) => {
  return async (req, res, next) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
  
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const numberOfDocument = await model.countDocuments().exec();
const test = await model.find({})
    // object to carry the pagination result
    const result = {};

    // set the next page
    if (endIndex < numberOfDocument) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }

    // set the previous page
    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    // set all number of pages
    if (limit) result.count = Math.ceil(numberOfDocument / limit);

    // getting the data base on the model
    try {
      result.data = await model.find({}).limit(limit).skip(startIndex).exec();
      req.paginatedResult = result;
      next();
    } catch (error) {
      res.status(500).json(error.messages);
    }
  };
};

module.exports = paginateMode;
