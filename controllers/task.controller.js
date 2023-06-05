const User = require('../models/user.model');
const Task = require('../models/task.model');

const STATUS_VALUES = ['Not Completed', 'Completed'];

const getTaskForUser = async (req, res) => {

  const userId = req.userId;
  const {status} = req.query;


  // Return only the status
  if (status) {
    if (STATUS_VALUES.includes(status)) {
      try {
        const tasks = await Task.findAll({
          where: {
            UserId: userId,
            status: status,
          },
        });

        return res.json({
          status: 'success',
          message: 'Successfully retrieve tasks',
          data: tasks,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({
          status: 'fail',
          message: err.message,
        });
      }
    } else {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid status value: ${status}`,
      });
    }
  }

  // Return all
  try {
    const tasks = await Task.findAll({
      where: {
        UserId: userId,
      },
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
  const {description} = req.body;

  if (!description) {
    return res.status(400).json({
      status: 'fail',
      message: 'Description cannot be empty',
    });
  }

  try {
    const task = await Task.create({
      UserId: userId,
      description: description,
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

const updateTaskForUser = async (req, res) => {
  const userId = req.userId;
  const {taskId, description, status} = req.body;

  if (!taskId || !status) {
    return res.status(400).json({
      status: 'fail',
      message: 'taskId or status cannot be empty.',
    });
  }

  if (!STATUS_VALUES.includes(status)) {
    return res.status(400).json({
      status: 'fail',
      message: `Invalid status value: ${status}`,
    });
  }

  try {

    if (!description) {
      await Task.update({
        status: status,
      },
      {
        where: {
          'task_id': taskId,
        },
      });
    } else {
      await Task.update({
        description: description,
        status: status,
      },
      {
        where: {
          'task_id': taskId,
        },
      });
    }

    return res.json({
      status: 'success',
      message: 'Task updated successfully',
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }
};

const deleteTaskForUser = async (req, res) => {

  const userId = req.userId;
  const {taskId} = req.body;

  if (!taskId) {
    return res.status(400).json({
      status: 'fail',
      message: 'taskId cannot be empty',
    });
  }

  try {

    await Task.destroy({
      where: {
        'task_id': taskId,
      },
    });

    return res.json({
      status: 'success',
      message: 'Successfully deleted the task',
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }

};

module.exports = {
  getTaskForUser,
  createTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
};
