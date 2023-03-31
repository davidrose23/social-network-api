const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^\S+@\S+\.\S+$/ 
  },
  thoughts: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'Thought' 
    }
  ],
  friends: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ]
}, {
  toJSON: {
    virtuals: true 
  },
  id: false 
});

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const thoughtSchema = new Schema({
  thoughtText: { 
    type: String, 
    required: true, 
    minlength: 1, 
    maxlength: 280 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    get: timestamp => new Date(timestamp).toISOString() 
  },
  username: { 
    type: String, 
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reactions: [
    {
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
      },
      reactionBody: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
      },
      username: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  toJSON: {
    virtuals: true 
  },
  id: false 
});

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const User = model('User', userSchema);
const Thought = model('Thought', thoughtSchema);

module.exports = { User, Thought };
