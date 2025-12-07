const mongoose = require('mongoose');
/**
 * Task Schema
 * Defines the structure for a task in the database.
 */
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    dueDate: {
        type: String, 
    },
    createdAt: {
        type: Number,
        default: Date.now
    }
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            ret.id = ret._id; 
            delete ret._id;
        }
    },
    toObject: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

module.exports = mongoose.model('Task', taskSchema);
