const mongoose = require('mongoose');
const casual = require('casual');
const { User, Thought } = require('./models');

// Define the number of records to create
const NUM_USERS = 10;
const NUM_THOUGHTS_PER_USER = 5;

// Connect to the database
mongoose.connect('mongodb://localhost/social-network-api');

// Define the seed function
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected!');
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

async function seed() {
  await User.deleteMany();
  await Thought.deleteMany();

  for (let i = 0; i < NUM_USERS; i++) {
    const username = casual.username;
    const user = new User({
      username: username,
      email: casual.email,
      password: casual.password
    });
    await user.save();

    for (let j = 0; j < NUM_THOUGHTS_PER_USER; j++) {
      const thought = new Thought({
        thoughtText: casual.sentence,
        createdAt: casual.moment,
        user: user._id,
        username: username
      });
      await thought.save();
      user.thoughts.push(thought);
    }
    await user.save();
  }

  console.log('Database seeded successfully!');
  mongoose.connection.close();
}

seed().catch(err => console.error(err));
