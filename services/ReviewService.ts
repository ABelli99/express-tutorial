import ReviewModel, {Review} from "../models/ReviewModel";
import ErrorResponse from "../utils/ErrorResponseUtils";
import { propertyExistsIn } from "../utils/sortChecks";

export interface QueryOptions {
    pageSize: number
    pageNumber: number
    sort?: string
    populate?: string
}

export class ReviewService {

    constructor() {};

    reviews = ReviewModel;
    

    public async find(query: object, queryOptions: QueryOptions): Promise<Review[]> {
        const result = this.reviews
        .find(query)
        .skip(queryOptions.pageSize*(queryOptions.pageNumber-1))
        .limit(queryOptions.pageSize);

        if (queryOptions.populate) {
            result.populate(queryOptions.populate);
        }

        if(queryOptions.sort){
            
            if(queryOptions.sort.toString()==""){
                return [];
            }

            result.sort(queryOptions.sort.toString());
        } else {
            result.sort('-createdAt');
        }

        return await result.exec();
    }

    
    public async totalEntries(query: object, queryOptions: QueryOptions): Promise<number>{
        const result = this.reviews
        .countDocuments()
        return await result.exec();
    }
}
