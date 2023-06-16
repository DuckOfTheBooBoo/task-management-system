/* eslint-disable max-len */
$(function() {
  toastr.options = {
    'closeButton': true,
    'debug': true,
    'newestOnTop': true,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut',
  };

  const dateStringify = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleDateString('en-US', options).replace('at', ' ');
  };

  const refreshTasks = async () => {
    $('.row-task').remove();
    try {
      const response = await axios.get('/api/task');
      const data = response.data.data;

      localStorage.setItem('tasks', JSON.stringify(data));

      data.forEach((task) => {
        const newRow = $('<tr>').data('taskId', task.id);
        newRow.addClass('row-task');

        const description = $('<td>').text(task.description);
        description.addClass('description');

        const dateCreated = $('<td>')
            .text(dateStringify(task.createdAt))
            .addClass('dates date-created');
        const dateUpdated = $('<td>')
            .text(dateStringify(task.updatedAt))
            .addClass('dates date-updated');

        const options = $('<td>');
        const select = $('<select>');
        select.addClass('status-select');

        // eslint-disable-next-line max-len
        const notCompleted = $('<option>').val('Not Completed').text('Not Completed');
        const completed = $('<option>').val('Completed').text('Completed');

        const action = $('<td>').addClass('action-column');
        const deleteButton = $('<button>').addClass('delete-btn');
        deleteButton.append($('<i>').addClass('fa-solid fa-trash fa-lg'));

        const updateButton = $('<button>').addClass('update-btn');
        updateButton.append($('<i>').addClass('fa-solid fa-pen-to-square'));

        action.append([deleteButton, updateButton]);
        // Append notCompleted and completed to select
        select.append([notCompleted, completed]);
        // Select default value
        switch (task.status) {
          case 'Completed':
            completed.prop('selected', true);
            break;

          case 'Not Completed':
            notCompleted.prop('selected', true);

          default:
            break;
        }

        // Append select to options
        options.append(select);

        // Append all the rest of <td>
        newRow.append([description, dateCreated, dateUpdated, options, action]);

        // Append <tr> to <table>
        $('#table-tasks tbody').append(newRow);

      });

      $('.tasks').slideToggle();

      // Add change event listener to every select element
      $('.row-task select').on('change', function(event) {
        const taskId = $(this).closest('tr').data('taskId');
        const value = $(this).val();
        const updatedDate = $(this).closest('.row-task').find('.date-updated');

        axios.put('/api/task', {taskId: taskId, status: value})
            .then((response) => {
              const responseBody = response.data;
              const date = responseBody.data[0].updatedAt;
              updatedDate.text(dateStringify(date));
              toastr.success(responseBody.message);
            })
            .catch((error) => {
              toastr.error('An error occured');
              console.error(error);
            });

      });

      $('.update-btn').on('click', function(event) {
        const parentTr = $(this).closest('tr');
        const taskId = parentTr.data('taskId');
        const description = $(this).closest('.row-task').find('.description');
        const currentStatus = $(this).closest('.row-task').find('.status-select').val();
        const updatedDate = $(this).closest('.row-task').find('.date-updated');

        customPrompt('Description', 'Update', 'Cancel', description.text(), 'PUT', {taskId: taskId, status: currentStatus})
            .then((response) => {
              const date = response.data[0].updatedAt;
              const newDesc = response.data[0].description;
              updatedDate.text(dateStringify(date));
              description.text(newDesc);
            });
      });

      $('.delete-btn').on('click', function(event) {
        const parentTr = $(this).closest('tr');
        const taskId = parentTr.data('taskId');
        axios.delete('/api/task', {data: {taskId: taskId}})
            .then((response) => {
              const responseBody = response.data;
              toastr.success(responseBody.message);
              parentTr.remove();
            })
            .catch((error) => {
              toastr.error('An error occured');
              console.error(error);
            });
      });

    } catch (err) {
      toastr.error('An error occured.');
      console.error(err);
    }
  };

  // Show/hide task function
  $('.task-header').on('click', () => {
    $('.tasks').slideToggle();
  });

  $('#new-btn').on('click', () => {
    customPrompt('Description', 'Add', 'Cancel', '', 'POST')
        .then((result) => {
          if (result) {
            if ($('.tasks').css('display') !== 'none') {
              $('.tasks').slideToggle();
            }
            refreshTasks();
          }
        });
  });

  // Logout button
  $('#logout-btn').on('click', function() {
    customConfirm('Are you sure you want to log out?')
        .then((result) => {
          if (result) {
            axios.post('/api/auth/logout')
                .then((response) => {
                  window.location.href = '/login';
                })
                .catch((err) => {
                  toastr.error('An error occurred');
                  console.error(err);
                });
          }
        })
        .catch((err) => {
          toastr.error('An error occurred');
          console.error(err);
        });
  });

  refreshTasks();

});
