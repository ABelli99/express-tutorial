import CourseModel, {Course} from "../models/CourseModel";
import ErrorResponse from "../utils/ErrorResponseUtils";
import { QueryOptions } from "../utils/QueryOptions";
import { isValidSort, propertyExistsIn } from "../utils/sortChecks";

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

        //if exists
        if(queryOptions.sort){  
            if(isValidSort(this.courses.schema, queryOptions.sort)){
                result.sort(queryOptions.sort.toString());
            }
        }else {
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
