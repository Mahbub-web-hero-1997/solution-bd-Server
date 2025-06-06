const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise.resolve(reqHandler(req, res, next).catch(next));
  };
};

export default asyncHandler;
