import mongoose, { Model, Schema } from 'mongoose';

import Bootcamp from './Bootcamp';

interface Review extends mongoose.Document {
  title: string;
  text: string;
  rating: number;
  createdAt: Date;
  bootcamp: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  getAverageRating(bootcampId:  Schema.Types.ObjectId): number | undefined;
}

const ReviewSchema: Schema<Review> = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add some text']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 and 10']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.static('getAverageRating', async function(bootcampId:  Schema.Types.ObjectId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (obj[0]) {
      await Bootcamp.findByIdAndUpdate(bootcampId, {
        averageRating: obj[0].averageRating.toFixed(1),
      });
    } else {
      await Bootcamp.findByIdAndUpdate(bootcampId, {
        averageRating: undefined,
      });
    }
  }  catch (err) {
    console.error(err);
  }
});

// Call getAverageCost after save
ReviewSchema.post('save', async function() {
  await this.getAverageRating(this.bootcamp);
});

// Call getAverageCost before remove
ReviewSchema.post<Review>('deleteOne', async function() {
  await this.getAverageRating(this.bootcamp);
});

const ReviewModel: Model<Review> = mongoose.model('Review', ReviewSchema);

export default ReviewModel;