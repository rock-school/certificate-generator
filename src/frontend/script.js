const form = document.querySelector('.mainForm');

function ValidateEmail(email) 
{
 if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/.test(email))
  {
    return true;
  }

    return false;
}

form.addEventListener('submit', () => {
  const emailInput = document.querySelector('.email input');
  const emailValue = emailInput.value;

  const isEmailCorrect = ValidateEmail(emailValue);
  if (isEmailCorrect) {
      const formElement = document.forms.sertificate;
      const fromData = new FormData(formElement);
      window.location.href = 'congratulations.html'
  } else {
    alert("You have entered an invalid email address!")
  }
})