import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async (): Promise<void> => {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
        useUnifiedTopology: true
    } as ConnectOptions);

    console.log(`MongoDB connected @ ${conn.connection.host}`);
}

export default connectDB;