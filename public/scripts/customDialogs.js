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

const customPrompt = (placeholderMsg, trueBtnVal, falseBtnVal, inputName) => {
  const customPromptDialog = $('<div>').addClass('custom-prompt-dialog');

  const promptForm = $('<form>').addClass('input-container').attr('id', 'custom-prompt-dialog-form');

  const formInput = $('<input>').attr({
    'id': 'descInput',
    'type': 'text',
    'name': inputName,
    'placeholder': placeholderMsg,
  });

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
              $('.custom-prompt-dialog').remove();
            }
          })
          .catch((err) => {
            console.error(err);
            toastr.error('Failed', err.message);
          });
    },
  });
};
