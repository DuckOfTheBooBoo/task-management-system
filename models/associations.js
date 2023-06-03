const User = require('./user.model');
const Task = require('./task.model');

User.hasMany(Task);
Task.belongsTo(User);
