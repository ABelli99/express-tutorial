import { Schema } from "mongoose";

export interface BootcampDTO {
    name: string;
    slug: string;
    description: string;
    website: string;
    phone: string;
    email: string;
    address: string;
    careers: string[];
    averageRating: number;
    averageCost: number;
    photo: string;
    housing: boolean;
    jobAssistance: boolean;
    jobGuarantee: boolean;
    acceptGi: boolean;
    user: Schema.Types.ObjectId;
}