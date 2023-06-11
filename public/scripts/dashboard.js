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


});
