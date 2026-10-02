const User = require('../models/User');
const Product = require('../models/Product');
const Rental = require('../models/Rental');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Delivery = require('../models/Delivery');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProducts,
      activeRentals,
      openMaintenance,
      scheduledDeliveries,
      revenueAgg,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Rental.countDocuments({ status: 'active' }),
      MaintenanceRequest.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      Delivery.countDocuments({ status: 'scheduled' }),
      Rental.aggregate([
        { $match: { status: { $in: ['active', 'confirmed'] } } },
        { $group: { _id: null, mrr: { $sum: '$monthlyTotal' } } },
      ]),
    ]);

    const products = await Product.find();
    const rentedCount = await Rental.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$items' },
      { $group: { _id: null, total: { $sum: '$items.quantity' } } },
    ]);

    const totalStock = products.reduce((s, p) => s + p.stock, 0);
    const rentedTotal = rentedCount[0]?.total || 0;
    const utilization =
      totalStock + rentedTotal > 0
        ? ((rentedTotal / (totalStock + rentedTotal)) * 100).toFixed(1)
        : 0;

    res.json({
      totalUsers,
      totalProducts,
      activeRentals,
      openMaintenance,
      scheduledDeliveries,
      mrr: revenueAgg[0]?.mrr || 0,
      productUtilization: `${utilization}%`,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getAllRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'name email phone')
      .populate('items.product', 'name category')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    next(err);
  }
};

exports.getAllDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find()
      .populate('rental')
      .sort({ scheduledDate: 1 });
    res.json(deliveries);
  } catch (err) {
    next(err);
  }
};

exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.status = req.body.status || delivery.status;
    delivery.partnerName = req.body.partnerName || delivery.partnerName;
    delivery.partnerPhone = req.body.partnerPhone || delivery.partnerPhone;
    if (delivery.status === 'completed') delivery.completedAt = new Date();

    await delivery.save();
    res.json(delivery);
  } catch (err) {
    next(err);
  }
};