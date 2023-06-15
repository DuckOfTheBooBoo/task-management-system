/* eslint-disable max-len */
$(function() {
  // Custom submit form post logic
  const sumbmitForm = async (data) => {
    try {
      const response = await axios.post('/api/auth/signup', data);
      if (response.statusText === 'OK') {
        alert('Successfully created new account!');

        window.location.href = '/login';
      } else {
        console.log(response);
      }
    } catch (err) {
      console.error(err);
      const responseData = err.response.data;
      alert(responseData.message);
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
  $.validator.addMethod('noWhitespace', (value, element) => {
    return !/\s/.test(value);
  });
  $.validator.addMethod('noUppercase', (value, element) => {
    return !/[A-Z]/.test(value);
  });

  $('#signup-form').validate({
    rules: {
      username: {
        required: true,
        minlength: 5,
        noUppercase: true,
        noWhitespace: true,
      },
      password: {
        required: true,
        containsUppercase: true,
        containsLowercase: true,
        containsNumber: true,
      },
      confirmPassword: {
        required: true,
        equalTo: '#password',
      },
    },
    messages: {
      username: {
        required: 'Please enter your username',
        minlength: 'Username must consist of at least 5 characters',
        noUppercase: 'Username must be in lowercase',
        noWhitespace: 'Username must not contain space',
      },
      password: {
        required: 'Please enter your password',
        containsUppercase: 'Password must consist of atleast 1 uppercase letter',
        containsLowercase: 'Password must consist of atleast 1 lowercase letter',
        containsNumber: 'Password must consist of atleast 1 number',
      },
      confirmPassword: {
        required: 'Please enter your password',
        equalTo: 'Password do not match',
      },
    },
  });

  $('#signup-form').on('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};

    for (const [key, val] of formData.entries()) {
      data[key] = val;
    }
    sumbmitForm(data);
  });

});
