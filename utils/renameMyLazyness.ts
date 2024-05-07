import { Request, Response } from "express";
import { QueryOptions } from "../repositories/GenericRepo";
import { isValidSort } from "./sortChecks";
import { Model } from "mongoose";

type genericService<T> = {
    find(query:any, QueryOptions: QueryOptions):Promise<T[]>,
    totalEntries(query:any, QueryOptions: QueryOptions):number
}


export async function getPaginatedResponseFromRequest
<
    T extends genericService<Y>, 
    X extends Model<Y>, 
    Y
>(
    serviceImport:T, 
    model: X, 
    req: Request, 
    res: Response
): Promise<Response> {
    const service:T = serviceImport;
    let result: Y[] | undefined = undefined;
    let query: any
    const {
        pageSize, 
        pageNumber, 
        sort
    } = req.body;
    const queryOptions: QueryOptions = {
        populate: "bootcamp", 
        pageSize: pageSize, 
        pageNumber: pageNumber, 
        sort: sort
    };

    if(!isValidSort(model.schema, sort)){
        return res.status(400).send("Bad sort args!");
    }

    //all reviews from single bootcamp
    if (req.params.bootcampId) {
        query = { bootcamp: req.params.bootcampId };
        const result = await service.find(query, queryOptions);
    }else {//all reviews from all bootcamp
        query = req.body.query;
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
}