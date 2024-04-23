import CourseModel, {Course} from "../models/Course";
import { getSortQuery } from "../utils/sort";

export interface QueryOptions {
    pageSize: number
    pageNumber: number
    sort?: JSON
    populate?: string
}

export class CourseService {

    constructor() {};

    courses = CourseModel;
    

    public async find(query: object, queryOptions: QueryOptions): Promise<Course[]> {
        const result = this.courses
        .find(query)
        .skip(queryOptions.pageSize*(queryOptions.pageNumber-1))
        .limit(queryOptions.pageSize);

        if (queryOptions.populate) {
            result.populate(queryOptions.populate);
        }

        if(queryOptions.sort){  
            result.sort(getSortQuery(queryOptions.sort));
        } else {
            result.sort('-createdAt');
        }

        return await result.exec();
    }

    
    public async totalEntries(query: object, queryOptions: QueryOptions): Promise<number>{
        const result = this.courses
        .countDocuments()
        return await result.exec();
    }
}
