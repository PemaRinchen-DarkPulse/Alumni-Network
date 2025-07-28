const Event = require('../models/eventModel');
const path = require('path');
const fs = require('fs');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 }) // Sort by date ascending (upcoming first)
      .populate('createdBy', 'name avatar');
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('registeredUsers', 'name avatar');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, date, venue, description } = req.body;
    
    // Create new event
    const newEvent = new Event({
      title,
      date,
      venue,
      description,
      image: req.body.image || null, // Use the uploaded image path or null
      createdBy: req.user._id // From auth middleware
    });
    
    await newEvent.save();
    
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updateData = req.body;
    
    // Find event and check ownership
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Only allow the event creator or admin to update
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    // Delete old image if new one is provided
    if (req.body.image && event.image) {
      const oldImagePath = path.join(__dirname, '..', event.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { ...updateData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Find event and check ownership
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Only allow the event creator or admin to delete
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    // Delete image file if it exists
    if (event.image) {
      const imagePath = path.join(__dirname, '..', event.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete the event
    await Event.findByIdAndDelete(eventId);
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;
    
    // Find the event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is already registered
    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    
    // Add user to registered users
    event.registeredUsers.push(userId);
    await event.save();
    
    res.status(200).json({ 
      message: 'Successfully registered for the event',
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for event', error: error.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;
    
    // Find the event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is registered
    if (!event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }
    
    // Remove user from registered users
    event.registeredUsers = event.registeredUsers.filter(
      id => id.toString() !== userId.toString()
    );
    
    await event.save();
    
    res.status(200).json({ 
      message: 'Successfully canceled registration',
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling registration', error: error.message });
  }
};
