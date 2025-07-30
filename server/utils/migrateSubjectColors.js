const mongoose = require('mongoose');
const Subject = require('../models/subjectModel');

const colors = [
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#8B5A2B', // Brown
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6'  // Teal
];

const migrateSubjectColors = async () => {
  try {
    console.log('Starting subject color migration...');
    
    // Find subjects without cardColor
    const subjectsWithoutColor = await Subject.find({
      $or: [
        { cardColor: { $exists: false } },
        { cardColor: null },
        { cardColor: '' }
      ]
    });

    console.log(`Found ${subjectsWithoutColor.length} subjects without colors`);

    for (let i = 0; i < subjectsWithoutColor.length; i++) {
      const subject = subjectsWithoutColor[i];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      await Subject.findByIdAndUpdate(subject._id, {
        cardColor: randomColor
      });
      
      console.log(`Updated ${subject.name} with color ${randomColor}`);
    }

    console.log('Subject color migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

module.exports = migrateSubjectColors;

// If run directly
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/alumni-network')
    .then(() => {
      console.log('Connected to MongoDB');
      return migrateSubjectColors();
    })
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
