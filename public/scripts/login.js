// Check if client have jwtToken in localStorage
const verifyToken = async () => {
  const jwtToken = localStorage.getItem('jwtToken');
  console.log(jwtToken);
  if (jwtToken) {
    try {
      const response = await axios.post('/api/verifyToken', {}, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (response.statusText === 'OK') {
        window.location.href = '/';
      }
    } catch (err) {
      console.error(err);
    }
  }
};

$(function() {
  verifyToken();
});

const sumbmitForm = async (data) => {
  try {
    const response = await axios.post('/api/auth/login', data);
    if (response.statusText === 'OK') {
      const token = response.data.token;
      localStorage.setItem('jwtToken', token);

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

const checkPassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber;
};

$('#form-password').on({
  focus: function() {
    $('.password-warning').slideDown(480);
  },
});

$('#login-form').on('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {};

  for (const [key, val] of formData.entries()) {
    data[key] = val;
  }

  if (checkPassword(data.password)) {
    sumbmitForm(data);
  } else {
    $('#password-warning').addClass('warning-state');

    setTimeout(() => {
      $('#password-warning').removeClass('warning-state');
    }, 1000);
  }

});
