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

      data.forEach((task) => {
        const newRow = $('<tr>');
        newRow.addClass('row-task');

        const description = $('<td>').text(task.description);
        description.addClass('description');

        const dateCreated = $('<td>').text(task.createdAt);

        const options = $('<td>');
        const select = $('<select>').data('taskId', task.id);
        select.addClass('status-select');

        // eslint-disable-next-line max-len
        const notCompleted = $('<option>').val('Not Completed').text('Not Completed');
        const completed = $('<option>').val('Completed').text('Completed');

        // Append notCompleted and completed to select
        select.append(notCompleted);
        select.append(completed);

        // Append select to options
        options.append(select);

        // Append all the rest of <td>
        newRow.append(description);
        newRow.append(dateCreated);
        newRow.append(options);

        // Append <tr> to <table>
        $('#table-tasks tbody').append(newRow);

      });
      $('.tasks').slideToggle();

    } catch (err) {
      console.error(err);
    }
  };

  // Show/hide task function
  $('.task-header').on('click', () => {
    $('.tasks').slideToggle();
  });

  $('#new-btn').on('click', () => {
    $('.add-task-dialog').css('display', 'flex');
  });

  $('#add-task-form').validate({
    rules: {
      descInput: {
        required: true,
        maxlength: 255,
      },
    },
    messages: {
      descInput: {
        required: 'Description cannot be empty!',
        maxlength: 'Description cannot be longer than 255',
      },
    },
    submitHandler: (form) => {
      const formData = new FormData(form);
      const data = {};

      for (const [key, val] of formData.entries()) {
        data[key] = val;
      }

      submitForm(data, '/api/task')
          .then((response) => {
            if (response) {
              toastr.success(response.message, 'Success');
            }
          })
          .catch((err) => {
            console.error(err);
            toastr.error('Failed', err.message);
          });
    },
  });

  $('#cancel-add-btn').on('click', () => {
    $('.add-task-dialog').css('display', 'none');
  });

  refreshTasks();

});
