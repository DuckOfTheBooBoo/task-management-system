$(function() {
  toastr.options = {
    'closeButton': true,
    'debug': true,
    'newestOnTop': true,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': true,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut',
  };

  const refreshTasks = async () => {
    try {
      const response = await axios.get('/api/task');
      const data = response.data.data;

      localStorage.setItem('tasks', JSON.stringify(data));

      data.forEach((task) => {
        const newRow = $('<tr>').data('taskId', task.id);
        newRow.addClass('row-task');

        const description = $('<td>').text(task.description);
        description.addClass('description');

        const dateCreated = $('<td>').text(task.createdAt);

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

        action.append(deleteButton);
        action.append(updateButton);

        // Append notCompleted and completed to select
        select.append(notCompleted);
        select.append(completed);

        // Append select to options
        options.append(select);

        // Append all the rest of <td>
        newRow.append(description);
        newRow.append(dateCreated);
        newRow.append(options);
        newRow.append(action);

        // Append <tr> to <table>
        $('#table-tasks tbody').append(newRow);

      });

      $('.tasks').slideToggle();

      // Add change event listener to every select element
      $('.row-task select').on('change', function(event) {
        const taskId = $(this).closest('tr').data('taskId');
        const value = $(this).val();

        axios.put('/api/task', {taskId: taskId, status: value})
            .then((response) => {
              const responseBody = response.data;
              toastr.success('Success', responseBody.message);
            })
            .catch((error) => {
              toastr.error('An error occured');
              console.error(error);
            });

      });

      // $('.update-btn').on('click', function(event) {
      //   const parentTr = $(this).closest('tr');
      //   const taskId = parentTr.data('taskId');

      //   $('#descInput').val();
      //   $('#confirm-add-btn').

      // });

      $('.delete-btn').on('click', function(event) {
        const parentTr = $(this).closest('tr');
        const taskId = parentTr.data('taskId');
        axios.delete('/api/task', {data: {taskId: taskId}})
            .then((response) => {
              const responseBody = response.data;
              toastr.success('Success', responseBody.message);
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
    customPrompt('Description', 'Add', 'Cancel', 'description');
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
