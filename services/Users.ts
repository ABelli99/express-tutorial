import UserModel, {User} from "../models/User";
import ErrorResponse from "../utils/errorResponse";

export interface QueryOptions {
    pageSize: number
    pageNumber: number
    populate?: string
    sort?: string
}

type UserKey = keyof User;
let CheckUser: UserKey;



const keysofUser: string[] = [
    "name",
    "email",
    "role",
    "password",
    "resetPasswordToken",
    "resetPasswordExpire",
    "confirmEmailToken",
    "isEmailConfirmed",
    "twoFactorCode",
    "twoFactorCodeExpire",
    "twoFactorEnable",
    "createdAt"
];

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

            let test = queryOptions.sort;
            
            test.replace(/-/g,"")
                .split(" ")
                .forEach(n => {
                    if(CheckUser=n){
                        throw new ErrorResponse(`cannot sort for ${n} property because ${n} is not a property of User`, 406)
                    }
                });

            result.sort(queryOptions.sort);
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
