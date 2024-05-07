import { Model, ObjectId } from "mongoose";
import UserModel, { User } from "../models/UserModel";
import { Course } from "../models/CourseModel";
import { Review } from "../models/ReviewModel";
import { Bootcamp } from "../models/BootcampModel";

export interface QueryOptions {
    pageSize:   number;
    pageNumber: number;
    sort:       string;
    populate?:   string;  
}

type dbmodels = User | Course | Review | Bootcamp;

//turn dbmodels types into enum of strings for populate in functions

export class CustomRepository<T extends dbmodels>{

    constructor(
        private readonly model: Model<T>
    ) {}

    public async findById(
        id: string, 
        queryOptions: QueryOptions
    ): Promise<T | null>{

        let query = this.model.findById(id).sort(queryOptions.sort)
        
        if(queryOptions.populate)
            query.populate(queryOptions.populate)

        return await query.exec();
    }

    public async totalEntries(
        query: object, 
        queryOptions?: QueryOptions
    ): Promise<number>{
        const result = this.model.countDocuments()
        return await result.exec();
    }
}