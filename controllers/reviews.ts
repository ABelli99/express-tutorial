import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';
import ReviewModel, { Review } from '../models/Review';
import Bootcamp from '../models/Bootcamp';
import { ReviewService, QueryOptions } from '../services/Reviews';
import { getUserFromRequest } from '../services/Auths';
import { ReviewDTO } from '../DTO/ReviewDTO';


// @desc      Get reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
export const getReviews = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //all reviews from single bootcamp
  if (req.params.bootcampId) {
    const reviews = await ReviewModel.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    //all reviews from all bootcamps
    const {pageSize, pageNumber, sort} = req.body;

    let query = req.body.query;
    const queryOptions: QueryOptions = {populate: "bootcamp", pageSize: pageSize, pageNumber: pageNumber, sort: sort};


    const service = new ReviewService();

    const result: Review[] = await service.find(query, queryOptions);
    if (!result) {
      return res.status(404).send("No Reviews founded!");
    }

    let body:any = result;

    body.push("pageSize", pageSize)
    body.push("pageNumber", pageNumber);
    body.push("maxItems", await service.totalEntries(query, queryOptions));
  
    res.status(200).send(body);
  }
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