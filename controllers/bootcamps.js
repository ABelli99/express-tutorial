/**
 * @description     Get all Bootcamps
 * @route           GET /api/v1/bootcamps
 * @access          Public
 */
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true, 
        msg: 'show all bootcamps'
    });
}

/**
 * @description     Get single Bootcamps
 * @route           GET /api/v1/bootcamps/:id
 * @access          Public
 */
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true, 
        msg: 'show single bootcamps'
    });
}

/**
 * @description     Create new Bootcamps
 * @route           POST /api/v1/bootcamps
 * @access          Private
 */
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true, 
        msg: 'create new bootcamps'
    });
}

/**
 * @description     update single Bootcamp
 * @route           PUT /api/v1/bootcamps/:id
 * @access          Public
 */
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true, 
        msg: 'update single bootcamps'
    });
}

/**
 * @description     delete single Bootcamps
 * @route           DELETE /api/v1/bootcamps/:id
 * @access          Public
 */
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true, 
        msg: 'delete single bootcamps'
    });
}