import { NextFunction } from 'express';
import { AdvRequest, AdvResponse } from '../utils/advanceResponse';

const advancedResults = (model: any, populate: string) => async (req: AdvRequest, res: AdvResponse, next: NextFunction) => {
  let query: any;

  // Copy req.query
  const reqQuery: any = { ...req.query };

  // Fields to exclude
  const removeFields: string[] = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param: string) => delete reqQuery[param]);

  // Create query string
  let queryStr: string = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match: string) => `$${match}`);

  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields: string = req.query.select.toString().split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy: string = req.query.sort.toString().split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = parseInt(req.query.limit as string, 10) || 25;
  const startIndex: number = (page - 1) * limit;
  const endIndex: number = page * limit;
  const total: number = await model.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results: any = await query;

  // Pagination result
  const pagination: any = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

export default advancedResults;