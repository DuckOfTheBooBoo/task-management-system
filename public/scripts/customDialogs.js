/* eslint-disable max-len */
/* eslint-env jquery */
const customConfirm = (message) => {
  const container = $('<div>').addClass('custom-confirm-dialog');
  const mainContainer = $('<div>').addClass('confirm-dialog-container');

  const pMessage = $('<p>').text(message);

  // eslint-disable-next-line max-len
  const buttonContainer = $('<div>').addClass('confirm-dialog-button-container');
  const yesButton = $('<button>').attr('id', 'yes-btn').text('Yes');
  const noButton = $('<button>').attr('id', 'no-btn').text('No');

  buttonContainer.append(yesButton);
  buttonContainer.append(noButton);

  mainContainer.append(pMessage);
  mainContainer.append(buttonContainer);

  container.append(mainContainer);

  $('body').prepend(container);

  return new Promise((resolve, reject) => {
    yesButton.on('click', function() {
      container.remove();
      resolve(true);
    });

    noButton.on('click', function() {
      container.remove();
      resolve(false);
    });
  });
};

const customPrompt = (placeholderMsg, trueBtnVal, falseBtnVal, inputValue = '', method = '', dataParam = {}) => {
  const customPromptDialog = $('<div>').addClass('custom-prompt-dialog');

  const promptForm = $('<form>').addClass('input-container').attr({
    'id': 'custom-prompt-dialog-form',
    'action': '',
  });

  const formInput = $('<input>').attr({
    'id': 'descInput',
    'type': 'text',
    'name': 'description',
    'placeholder': placeholderMsg,
  }).val(inputValue);

  const buttonContainer = $('<div>').addClass('prompt-dialog-button-container');

  const falseBtn = $('<button>').attr({
    'id': 'false-btn',
    'type': 'button',
  }).text(falseBtnVal);

  const trueBtn = $('<button>').attr({
    'id': 'true-btn',
    'type': 'submit',
  }).text(trueBtnVal);

  buttonContainer.append([falseBtn, trueBtn]);
  promptForm.append([formInput, buttonContainer]);

  customPromptDialog.append(promptForm);

  $('body').prepend(customPromptDialog);

  $('#false-btn').on('click', function(event) {
    $('.custom-prompt-dialog').remove();
  });

  $('#custom-prompt-dialog-form').validate({
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
  });

  return new Promise((resolve) => {
    $('#custom-prompt-dialog-form').on('submit', function(event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const data = {};

      for (const [key, val] of formData.entries()) {
        data[key] = val;
      }

      $.ajax({
        url: '/api/task',
        type: method,
        data: {...data, ...dataParam},
        success: function(response) {
          toastr.success(response.message);
          customPromptDialog.remove();
          resolve(response);
        },
        error: function(xhr, status, error) {
          toastr.error(response.message);
          console.error('Error: ', error);
          console.error(status);
          console.error(xhr);
          customPromptDialog.remove();
          resolve(false);
        },
      });
    });
  });
};
