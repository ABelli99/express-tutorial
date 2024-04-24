import BootcampModel, {Bootcamp} from "../models/BootcampModel";
import ErrorResponse from "../utils/ErrorResponseUtils";
import { propertyExistsIn } from "../utils/sortChecks";

export interface QueryOptions {
    pageSize: number
    pageNumber: number
    sort?: string
    populate?: string
}

export class BootcampService {

    constructor() {};

    bootcamps = BootcampModel;
    

    public async find(query: object, queryOptions: QueryOptions): Promise<Bootcamp[]> {
        const result = this.bootcamps
        .find(query)
        .skip(queryOptions.pageSize*(queryOptions.pageNumber-1))
        .limit(queryOptions.pageSize);

        if (queryOptions.populate) {
            result.populate(queryOptions.populate);
        }

        if(queryOptions.sort){  
            switch (propertyExistsIn(queryOptions.sort, this.bootcamps.schema)) {
                //success
                case 0:
                    result.sort(queryOptions.sort);
                    break;
                case 1:
                    throw new ErrorResponse(`cannot sort for ${queryOptions.sort} property `
                        +`because there is something that is not a property of Bootcamp`, 406);
                case -1:
                    throw new ErrorResponse("there are two consecutive spaces or"
                        +"there is a space at the start or the end of the string, "
                        +"Teapot", 418);
            }
        } else {
            result.sort('-createdAt');
        }


        return await result.exec();
    }

    
    public async totalEntries(query: object, queryOptions: QueryOptions): Promise<number>{
        const result = this.bootcamps
        .countDocuments()
        return await result.exec();
    }
}

