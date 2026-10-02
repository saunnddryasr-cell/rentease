const Rental = require('../models/Rental');
const Product = require('../models/Product');
const Delivery = require('../models/Delivery');
const User = require('../models/User');

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

exports.createRental = async (req, res, next) => {
  try {
    const { items, tenureMonths, deliveryAddress, deliveryDate, deliverySlot } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'No items in rental' });
    }
    if (!tenureMonths || tenureMonths < 1) {
      return res.status(400).json({ message: 'Invalid tenure' });
    }

    let monthlyTotal = 0;
    let securityTotal = 0;
    const rentalItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
      if (product.stock < (item.quantity || 1)) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const qty = item.quantity || 1;
      monthlyTotal += product.monthlyRent * qty;
      securityTotal += product.securityDeposit * qty;

      rentalItems.push({
        product: product._id,
        quantity: qty,
        monthlyRent: product.monthlyRent,
        securityDeposit: product.securityDeposit,
      });
    }

    const startDate = deliveryDate ? new Date(deliveryDate) : new Date();
    const endDate = addMonths(startDate, tenureMonths);

    const rental = await Rental.create({
      user: req.user._id,
      items: rentalItems,
      tenureMonths,
      startDate,
      endDate,
      deliveryAddress,
      deliveryDate,
      deliverySlot,
      monthlyTotal,
      securityTotal,
      status: 'confirmed',
    });

    for (const it of rentalItems) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
    }

    if (deliveryDate) {
      await Delivery.create({
        rental: rental._id,
        type: 'delivery',
        scheduledDate: deliveryDate,
        slot: deliverySlot || '10:00-13:00',
        address: deliveryAddress,
      });
    }

    await User.findByIdAndUpdate(req.user._id, { $push: { activeRentals: rental._id } });

    res.status(201).json(rental);
  } catch (err) {
    next(err);
  }
};

exports.getMyRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('items.product', 'name images category monthlyRent')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    next(err);
  }
};

exports.getRentalById = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email phone');
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    if (req.user.role === 'user' && String(rental.user._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(rental);
  } catch (err) {
    next(err);
  }
};

exports.requestReturn = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (String(rental.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    rental.status = 'return_requested';
    rental.returnDate = req.body.returnDate || new Date();
    await rental.save();

    await Delivery.create({
      rental: rental._id,
      type: 'pickup',
      scheduledDate: rental.returnDate,
      slot: req.body.deliverySlot || '10:00-13:00',
      address: rental.deliveryAddress,
    });

    res.json(rental);
  } catch (err) {
    next(err);
  }
};

exports.requestExtension = async (req, res, next) => {
  try {
    const { additionalMonths } = req.body;
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (String(rental.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!additionalMonths || additionalMonths < 1) {
      return res.status(400).json({ message: 'Invalid extension period' });
    }

    rental.endDate = addMonths(rental.endDate, additionalMonths);
    rental.tenureMonths += additionalMonths;
    rental.extensionRequested = true;
    await rental.save();

    res.json(rental);
  } catch (err) {
    next(err);
  }
};

exports.cancelRental = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (String(rental.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (['active', 'returned'].includes(rental.status)) {
      return res.status(400).json({ message: 'Cannot cancel an active/returned rental' });
    }

    rental.status = 'cancelled';
    await rental.save();

    for (const it of rental.items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: it.quantity } });
    }

    res.json(rental);
  } catch (err) {
    next(err);
  }
};