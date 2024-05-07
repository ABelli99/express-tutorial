import UserModel, {User} from "../models/UserModel";
import ErrorResponse from "../utils/ErrorResponseUtils";
import { QueryOptions } from "../utils/QueryOptions";
import { propertyExistsIn } from "../utils/sortChecks";

export class UserService {

    constructor() {};

    users = UserModel;

    public async find(query: object, queryOptions: QueryOptions): Promise<User[]> {
        const result = this.users
        .find(query)
        .skip(queryOptions.pageSize*(queryOptions.pageNumber-1))
        .limit(queryOptions.pageSize);

        if (queryOptions.populate) {
            result.populate(queryOptions.populate);
        }

        if(queryOptions.sort){ 

            switch (propertyExistsIn(queryOptions.sort, this.users.schema)) {
                //success
                case 0:
                    result.sort(queryOptions.sort);
                    break;
                //property not found
                case 1:
                    throw new ErrorResponse(`cannot sort for ${queryOptions.sort} property `
                        +`because there is something that is not a property of User`, 406);
                //teapot
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
        const result = this.users
        .countDocuments()
        return await result.exec();
    }
}
