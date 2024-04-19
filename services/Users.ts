import UserModel, {User} from "../models/User";

export interface QueryOptions {
    populate?: string
    pageSize: number
    pageNumber: number
}

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

        return await result.exec();
    }
}
