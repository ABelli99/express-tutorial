/**
 * @description middleware
 */
const logger = (req, res, next) => {
    console.log('miao');
    next();
};

module.exports = logger;