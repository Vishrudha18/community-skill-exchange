const Availability = require("../models/Availability");

// Add / Update availability
exports.setAvailability = async (req, res) => {
  try {
    const { day, slots } = req.body;

    const existing = await Availability.findOne({
      user: req.user.id,
      day,
    });

    if (existing) {
      existing.slots = slots;
      await existing.save();
      return res.json(existing);
    }

    const availability = new Availability({
      user: req.user.id,
      day,
      slots,
    });

    await availability.save();
    res.status(201).json(availability);
  } catch (err) {
    res.status(500).json({ message: "Error saving availability" });
  }
};

// Get availability of a user
exports.getUserAvailability = async (req, res) => {
  try {
    const data = await Availability.find({
      user: req.params.userId,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching availability" });
  }
};