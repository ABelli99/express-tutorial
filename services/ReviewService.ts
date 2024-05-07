import ReviewModel, {Review} from "../models/ReviewModel";
import ErrorResponse from "../utils/ErrorResponseUtils";
import { propertyExistsIn } from "../utils/sortChecks";
import { CustomRepository, QueryOptions } from "../repositories/GenericRepo";
import { ObjectId } from "mongoose";

interface resultJSON {
    pageNumber:number,
    pageSize:number,
    totalDocuments:number,
    data:Review | null
}


export class ReviewService {

    constructor() {};

    defaultQueryOptions: QueryOptions = {
        pageSize:4, 
        pageNumber:4, 
        sort:"-createdAt"
    }

    reviews = ReviewModel;
    customrepo = new CustomRepository(ReviewModel)

    public async findById(
        id: string, 
        queryOptions: QueryOptions = this.defaultQueryOptions
    ):Promise<resultJSON>{

        let res = await this.customrepo.findById(id, queryOptions);

        /*
        let totalDocuments:number, data:JSON;

        if(typeof res == null){
            totalDocuments = 0;
            data = JSON.parse(`no result for that ID`);
        }else{
            totalDocuments = 0;
            data = JSON.parse(`${res}`);
        }
        return JSON.parse(`
            pageNumber: ${queryOptions.pageNumber},
            pageSize: ${queryOptions.pageSize},
            totalDocuments: ${totalDocuments},
            data: ${data}
        `)
        */
        
        let resJSON: resultJSON = {
            pageSize: queryOptions.pageSize,
            pageNumber: queryOptions.pageNumber,
            totalDocuments: ((typeof res) == null) ? 0 : 1,
            data: res
        }  

        return resJSON;
    }


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
                result.sort('-createdAt');
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
