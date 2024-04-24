import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/ErrorResponseUtils';
import asyncHandler from '../middleware/async';
import CourseModel, { Course } from '../models/CourseModel';
import Bootcamp from '../models/BootcampModel';
import { CourseService, QueryOptions } from '../services/CourseService';
import { getUserFromRequest } from '../services/AuthService';
import { CourseDTO } from '../DTO/CourseDTO';
// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
export const getCourses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const {pageSize, pageNumber, sort} = req.body;

  //all courses from single bootcamp
  if (req.params.bootcampId) {
    const courses = await CourseModel.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  }else {
    
    //all course from all bootcamps
    let query = req.body.query;
    const queryOptions: QueryOptions = {populate: "bootcamp", pageSize: pageSize, pageNumber: pageNumber, sort: sort};


    const service = new CourseService();

    const result: Course[] = await service.find(query, queryOptions);
    if (!result) {
      return res.status(404).send("No Courses founded!");
    }

    let body:any = result;

    body.push("pageSize", pageSize)
    body.push("pageNumber", pageNumber);
    body.push("maxItems", await service.totalEntries(query, queryOptions));
  
    res.status(200).send(body);
  }
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
export const getCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const course = await CourseModel.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
export const addCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

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

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== verifiedUser.id && verifiedUser.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${verifiedUser.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  const course = await CourseModel.create(req.body as CourseDTO);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
export const updateCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  let verifiedUser = await getUserFromRequest(req, next);
  let course = await CourseModel.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== verifiedUser.id && verifiedUser.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${verifiedUser.id} is not authorized to update course ${course._id}`,
        401
      )
    );
  }

  course = await CourseModel.findByIdAndUpdate(req.params.id, req.body as CourseDTO, {
    new: true,
    runValidators: true
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  course.save();

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
export const deleteCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
  let verifiedUser = await getUserFromRequest(req, next);
  const course = await CourseModel.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== verifiedUser.id && verifiedUser.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${verifiedUser.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});