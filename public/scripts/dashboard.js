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

  $('#new-btn').on('click', async () => {
    const newTask = prompt('Description: ');

    if (newTask) {
      try {
        const response = await axios.post('/api/task', {
          description: newTask,
        });

        if (response.statusText === 'OK') {
          toastr.success(response.data.message);
        }
      } catch (err) {
        console.error(err);
        toastr.success(response.data.message);
      }
    }

  });


});
