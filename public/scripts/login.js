/* eslint-disable max-len */
$(function() {
  // Check if client have jwtToken in localStorage
  // const verifyToken = async () => {
  //   const jwtToken = localStorage.getItem('jwtToken');
  //   console.log(jwtToken);
  //   if (jwtToken) {
  //     try {
  //       const response = await axios.post('/api/verifyToken', {}, {
  //         headers: {
  //           'Authorization': `Bearer ${jwtToken}`,
  //         },
  //       });

  //       if (response.statusText === 'OK') {
  //         window.location.href = '/';
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // };

  // Custom submit form post logic
  const sumbmitForm = async (data) => {
    try {
      const response = await axios.post('/api/auth/login', data);
      if (response.statusText === 'OK') {
        const token = response.data.token;

        alert('You are logged in!');

        window.location.href = '/dashboard';
      } else {
        console.log(response);
      }
    } catch (err) {
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

  // verifyToken();

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
      console.log('is awd');
      const formData = new FormData(form);
      const data = {};

      for (const [key, val] of formData.entries()) {
        data[key] = val;
      }
      sumbmitForm(data);
    },
  });
});
