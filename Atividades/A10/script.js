const masks = {
    nome(value) {
        return value
            .replace(/\b\w/g, function (match) {
                return match.toUpperCase();
            })
    },
    cpf(value) {
        return value
            .replace(/\D+/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
    },

    senha(value) {
        return value
            .replace(/./g, '*')
    },

    


    date(value) {
        return value
            .replace(/\D+/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\/\d{2})(\d)/, '$1/$2')
            .replace(/(\/\d{4})\d+?$/, '$1')
    },

    validarCPF(value) {
        const cleanValue = value.replace(/\D+/g, '');
        if (cleanValue.length !== 11) {
            return false;
        }

        const digitsAreEqual = /^(\d)\1*$/.test(cleanValue);
        if (digitsAreEqual) {
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanValue.charAt(i)) * (10 - i);
        }
        let verificationDigit1 = 11 - (sum % 11);
        if (verificationDigit1 >= 10) {
            verificationDigit1 = 0;
        }

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanValue.charAt(i)) * (11 - i);
        }
        let verificationDigit2 = 11 - (sum % 11);
        if (verificationDigit2 >= 10) {
            verificationDigit2 = 0;
        }

        const providedDigit1 = parseInt(cleanValue.charAt(9));
        const providedDigit2 = parseInt(cleanValue.charAt(10));
        if (verificationDigit1 !== providedDigit1 || verificationDigit2 !== providedDigit2) {
            return false;
        }

        return true;
    }
}

const emailInput = document.querySelector('input[data-js="email"]');

const validateEmail = () => {
    const email = emailInput.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailPattern.test(email);

    emailInput.classList.remove('valid', 'invalid');
    if (validEmail) {
        emailInput.classList.add('valid');
    } else {
        emailInput.classList.add('invalid');
    }
};

emailInput.addEventListener('input', validateEmail);

const passwordInput = document.querySelector('input[data-js="senha"]');
const passwordRequirements = document.getElementById('password-requirements');

const validatePassword = () => {
    const password = passwordInput.value;
    const requirementsMet = password.length >= 10;

    const li = passwordRequirements.querySelector('li');
    if (requirementsMet) {
        li.style.color = 'green';
    } else {
        li.style.color = 'initial';
    }

    passwordInput.classList.remove('valid', 'invalid');
    if (requirementsMet) {
        passwordInput.classList.add('valid');
    } else {
        passwordInput.classList.add('invalid');
    }
};

passwordInput.addEventListener('input', validatePassword);


document.querySelectorAll('input').forEach($input => {
    const field = $input.dataset.js;

    $input.addEventListener('input', e => {
        if (field === 'cpf') {
            const isValid = masks.validarCPF(e.target.value);
            if (!isValid) {
                e.target.classList.add('invalid');
            } else {
                e.target.classList.remove('invalid');
            }
        }

        e.target.value = masks[field](e.target.value);
    }, false);
})