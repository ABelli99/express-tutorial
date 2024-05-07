import path from 'path';
import slugify from "slugify";
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/ErrorResponseUtils';
import asyncHandler from '../middleware/async';
import geocoder from '../utils/GeocoderUtils';
import BootcampModel, { Bootcamp } from '../models/BootcampModel';
import { UploadedFile } from 'express-fileupload';
import { BootcampService } from '../services/BootcampService';
import { getUserFromRequest } from '../services/AuthService';
import { BootcampDTO } from '../DTO/BootcampDTO';
import { QueryOptions } from '../repositories/GenericRepo';

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  /**
   * Body:
   * {
   *  pageSize: 10,
   *  pageNumber: 2
   * }
   */

  /**
   * validation >>> call to service (params) => results: <T> >>> print results
   */
  const {pageSize, pageNumber, sort} = req.body;

  let query = req.body.query;
  const queryOptions: QueryOptions = {populate: "course", pageSize: pageSize, pageNumber: pageNumber, sort: sort};


  const service = new BootcampService();

  const result: Bootcamp[] = await service.find(query, queryOptions);
  if (!result) {
    return res.status(404).send("No Bootcamps founded!");
  }


  let body:any = result; //JSON.parse (?)

  body.push("pageSize", pageSize)
  body.push("pageNumber", pageNumber);
  body.push("maxItems", await service.totalEntries(query, queryOptions));


  res.status(200).send(body);
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
export const getBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const bootcamp = await BootcampModel.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
export const createBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  let verifiedUser = await getUserFromRequest(req, next);
  // Add user to req,body
  req.body.user = verifiedUser.id;

  // Check for published bootcamp
  const publishedBootcamp = await BootcampModel.findOne({ user: verifiedUser.id });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && verifiedUser.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${verifiedUser.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await BootcampModel.create(req.body as BootcampDTO);

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
export const updateBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  let verifiedUser = await getUserFromRequest(req, next);
  let bootcamp = await BootcampModel.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== verifiedUser.id && verifiedUser.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${verifiedUser.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }
  
  // update slug while updating name
  if (Object.keys(req.body).includes("name")) {
    req.body.slug = slugify(req.body.name, { lower: true });
  }

  bootcamp = await BootcampModel.findByIdAndUpdate(req.params.id, req.body as BootcampDTO, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
export const deleteBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
  let verifiedUser = await getUserFromRequest(req, next);
  const bootcamp = await BootcampModel.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== verifiedUser.id && verifiedUser.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${verifiedUser.id} is not authorized to delete this bootcamp`,
        401
      )
    );
  }

  await bootcamp.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
export const getBootcampsInRadius = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = parseInt(distance) / 3963;

  const bootcamps = await BootcampModel.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
export const bootcampPhotoUpload = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  let verifiedUser = await getUserFromRequest(req, next);
  const bootcamp = await BootcampModel.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== verifiedUser.id && verifiedUser.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${verifiedUser.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  
  const file: UploadedFile = req.files.file as UploadedFile;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > (process.env.MAX_FILE_UPLOAD ? 
      +process.env.MAX_FILE_UPLOAD : 
      0
    )
  ) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err:any) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await BootcampModel.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});