export const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
export const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/stillhungry';
export const otpExpiry = 10 * 60 * 1000;
