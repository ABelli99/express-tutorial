import mongoose, { Model, Schema } from 'mongoose';

import Bootcamp from './BootcampModel';
export interface Course extends mongoose.Document {
  title: string;
  description: string;
  weeks: number;
  tuition: number;
  minimumSkill: string;
  scholarshipAvailable: boolean;
  createdAt: Date;
  bootcamp: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  getAverageCost(bootcampId: Schema.Types.ObjectId): number;
}

const CourseSchema: Schema<Course> = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: Number,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
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

// Static method to get avg of course tuitions
CourseSchema.static('getAverageCost', 
  async function(bootcampId: Schema.Types.ObjectId) {
    const obj = await this.aggregate([
      {
        $match: { bootcamp: bootcampId }
      },
      {
        $group: {
          _id: '$bootcamp',
          averageCost: { $avg: '$tuition' }
        }
      }
    ]);

    const averageCost = obj[0]
      ? Math.ceil(obj[0].averageCost / 10) * 10
      : undefined;
    try {
      await Bootcamp.findByIdAndUpdate(bootcampId, {
        averageCost,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

// Call getAverageCost after save
CourseSchema.post<Course>('save', async function() {
  await this.getAverageCost(this.bootcamp);
});

// Call getAverageCost after remove
CourseSchema.post<Course>('deleteOne', async function () {
  await this.getAverageCost(this.bootcamp);
});

// Call getAverageCost after tuition update
CourseSchema.post<Course>('findOneAndUpdate', async function (doc: Course) {
  if (this.tuition != doc.tuition) {
    await doc.getAverageCost(doc.bootcamp);
  }
});

const Course: Model<Course> = mongoose.model('Course', CourseSchema);
export default Course;