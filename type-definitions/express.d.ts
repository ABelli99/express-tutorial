import CustomUser from '../models/User';

interface User extends CustomUser {}

declare module '@types/express-serve-static-core'{
    namespace Express {
        export interface Request {
            user?: User;
            files?: any;
        }

        export interface Response {
            advancedResults?: any;
        }
    }
}