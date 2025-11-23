/**
 * Async handler to wrap async routes and pass errors to next()
 * Removes the need for try-catch blocks in controllers
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
