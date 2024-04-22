import { Schema } from "mongoose";

export interface ReviewDTO {
    title: string;
    text: string;
    rating: number;
    bootcamp: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
  }