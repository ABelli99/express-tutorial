import CourseModel, {Course} from "../models/Course";

export interface QueryOptions {
    populate?: string
    pageSize: number
    pageNumber: number
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

        return await result.exec();
    }
}
