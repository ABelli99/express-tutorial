import BootcampModel, {Bootcamp} from "../models/Bootcamp";

export interface QueryOptions {
    populate?: string
    pageSize: number
    pageNumber: number
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

        return await result.exec();
    }
}

