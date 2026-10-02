const MaintenanceRequest = require('../models/MaintenanceRequest');
const Rental = require('../models/Rental');

exports.createRequest = async (req, res, next) => {
  try {
    const { rentalId, productId, issueType, description, preferredDate } = req.body;

    const rental = await Rental.findById(rentalId);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (String(rental.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not your rental' });
    }

    const request = await MaintenanceRequest.create({
      rental: rentalId,
      user: req.user._id,
      product: productId,
      issueType,
      description,
      preferredDate,
    });

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await MaintenanceRequest.find({ user: req.user._id })
      .populate('product', 'name images')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = req.body.status || request.status;
    request.remarks = req.body.remarks || request.remarks;
    if (request.status === 'resolved') request.resolvedAt = new Date();

    await request.save();
    res.json(request);
  } catch (err) {
    next(err);
  }
};