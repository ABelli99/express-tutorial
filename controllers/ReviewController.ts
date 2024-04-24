import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/ErrorResponseUtils';
import asyncHandler from '../middleware/async';
import ReviewModel, { Review } from '../models/ReviewModel';
import Bootcamp from '../models/BootcampModel';
import { ReviewService, QueryOptions } from '../services/ReviewService';
import { getUserFromRequest } from '../services/AuthService';
import { ReviewDTO } from '../DTO/ReviewDTO';
import { isValidSort } from '../utils/sortChecks';


// @desc      Get reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
export const getReviews = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
  const service = new ReviewService();
  let result: Review[] | undefined = undefined;
  let query: any
  const {pageSize, pageNumber, sort} = req.body;
  const queryOptions: QueryOptions = {populate: "bootcamp", pageSize: pageSize, pageNumber: pageNumber, sort: sort};

  if(!isValidSort(ReviewModel.schema, sort)){
    return res.status(400).send("Bad sort args!");
  }

  //all reviews from single bootcamp
  if (req.params.bootcampId) {
    let query = { bootcamp: req.params.bootcampId };
    const result = await service.find(query, queryOptions);
  } else {//all reviews from all bootcamp
    let query = req.body.query;
    result = await service.find(query, queryOptions);
  } 
  if (!result) {
    return res.status(404).send("No Reviews founded!");
  }
  if(!result.length){
    return res.status(418).json({
      success: false,
      reason: "Empty sort array! You are a Teapot"
    })
  }

  let maxItems = await service.totalEntries(query, queryOptions);
  return res.status(200).json({
    success: true,
    pageNumber: pageNumber,
    pageSize: pageSize,
    maxItems: maxItems,
    count: result.length,
    data: result
  });
});

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
export const getReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const review = await ReviewModel.find({_id: req.params.id});

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc      Add review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
export const addReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  let verifiedUser = await getUserFromRequest(req, next);

  req.body.bootcamp = req.params.bootcampId;
  req.body.user = verifiedUser.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await ReviewModel.create(req.body as ReviewDTO);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
export const updateReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
  let verifiedUser = await getUserFromRequest(req, next);
  let review = await ReviewModel.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== verifiedUser.id && verifiedUser.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  review = await ReviewModel.findByIdAndUpdate(req.params.id, req.body as ReviewDTO, {
    new: true,
    runValidators: true
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
export const deleteReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
  let verifiedUser = await getUserFromRequest(req, next);
  const review = await ReviewModel.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== verifiedUser.id && verifiedUser.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});