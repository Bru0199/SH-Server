import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    addons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Addon' }],
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const deliveryDetailsSchema = new mongoose.Schema(
  {
    name: { type: String },
    address: { type: String },
    phone: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    deliveryDetails: deliveryDetailsSchema,
    status: { type: String, default: 'Pending' },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    couponCode: { type: String },
    subTotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
    paymentStatus: { type: String, default: 'Pending' },
    orderID: { type: String, unique: true, sparse: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
