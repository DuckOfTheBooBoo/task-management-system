/* eslint-disable max-len */
$(function() {

  // Custom submit form post logic
  const sumbmitForm = async (data, endpoint) => {
    try {
      const response = await axios.post(endpoint, data);
      if (response.statusText === 'OK') {
        alert('You are logged in!');

        window.location.href = '/dashboard';
      } else {
        console.log(response);
      }
    } catch (err) {
      // const responseData = err.response.data;
      // alert(responseData.message);
      console.error(err);
    }
  };

  // Custom password validator
  $.validator.addMethod('containsUppercase', (value, element) => {
    return /[A-Z]/.test(value);
  });
  $.validator.addMethod('containsLowercase', (value, element) => {
    return /[a-z]/.test(value);
  });
  $.validator.addMethod('containsNumber', (value, element) => {
    return /[0-9]/.test(value);
  });


  $('#login-form').validate({
    rules: {
      username: {
        required: true,
        minlength: 5,
      },
      password: {
        required: true,
        containsUppercase: true,
        containsLowercase: true,
        containsNumber: true,
      },
    },
    messages: {
      username: {
        required: 'Please enter your username',
        minlength: 'Username must consist of at least 5 characters',
      },
      password: {
        required: 'Please enter your password',
        containsUppercase: 'Password must consist of atleast 1 uppercase letter',
        containsLowercase: 'Password must consist of atleast 1 lowercase letter',
        containsNumber: 'Password must consist of atleast 1 number',
      },
    },
    submitHandler: (form) => {
      const formData = new FormData(form);
      const data = {};

      for (const [key, val] of formData.entries()) {
        data[key] = val;
      }
      sumbmitForm(data, '/api/auth/login');
    },
  });
});
