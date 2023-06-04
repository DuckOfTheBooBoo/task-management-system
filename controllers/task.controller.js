const User = require('../models/user.model');
const Task = require('../models/task.model');

const getTaskForUser = async (req, res) => {

  const userId = req.userId;

  try {
    const tasks = await Task.findAll({
      where: {
        UserId: userId,
      },
      include: User,
    });

    return res.json({
      status: 'success',
      message: 'Successfully retrieve tasks',
      data: tasks,
    });

  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }

};

const createTaskForUser = async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  const {description} = req.body;

  try {
    const task = await Task.create({
      UserId: userId,
      task_desc: description,
      status: 'Not Completed',
    });

    console.log(task);

    return res.json({
      status: 'success',
      message: 'Successfully created task.',
    });

  } catch (err) {
    console.error(err.message);

    return res.status(400).json({
      status: 'fail',
      message: `Unable to create new task: ${err.message}`,
    });
  }

};

module.exports = {
  getTaskForUser,
  createTaskForUser,
};
