import { Schema } from "mongoose";

export interface CourseDTO {
    title: string;
    description: string;
    weeks: number;
    tuition: number;
    minimumSkill: string;
    scholarshipAvailable: boolean;
    bootcamp: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
}