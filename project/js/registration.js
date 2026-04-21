let loginTab = document.getElementById('loginTab');
let registerTab = document.getElementById('registerTab');
let submitBtn = document.getElementById('submitBtn');
let modeInput = document.querySelector('input[name="mode"]');
let form = document.getElementById('form');

loginTab.addEventListener('click', function() {
    modeInput.value = 'login';
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    submitBtn.textContent = 'Log in';

    let pass2 = document.getElementById('password2Box');
    if (pass2) pass2.style.display = 'none';
});

registerTab.addEventListener('click', function() {
    modeInput.value = 'register';
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    submitBtn.textContent = 'Register';

    let pass2 = document.getElementById('password2Box');
    if (pass2) {
        pass2.style.display = 'block';
    } else {
        let newBox = document.createElement('div');
        newBox.className = 'inputBox';
        newBox.id = 'password2Box';
        newBox.innerHTML = '<p>Repeat Password</p><input type="password" name="password2">';
        submitBtn.parentNode.insertBefore(newBox, submitBtn);
    }
});