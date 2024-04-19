import ReviewModel, {Review} from "../models/Review";

export interface QueryOptions {
    populate?: string
    pageSize: number
    pageNumber: number
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

        return await result.exec();
    }
}
