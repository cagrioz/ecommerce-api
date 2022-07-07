import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password, displayAlert) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/auth/signin',
            data: {
                email,
                password,
            },
        });

        if (res.statusText === 'OK') {
            if (displayAlert) showAlert('success', 'Logged in successfully!');

            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', 'Wrong email or password, please try again!');
    }
};

export const signup = async (name, email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/auth/signup',
            data: {
                name,
                email,
                password,
            },
        });

        if (res.statusText === 'Created') {
            showAlert('success', 'Your account is succesfully created! Logging in...');

            window.setTimeout(() => {
                location.assign('/');
            }, 1500);

            login(email, password, false);
        }
    } catch (err) {
        showAlert('error', 'User with this email already exist!');
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/auth/logout',
        });

        if ((res.data.status = 'success')) {
            location.reload(true);

            window.setTimeout(() => {
                location.assign('/');
            }, 3000);
        }

        showAlert('success', 'Logged out succesfully!');
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.');
    }
};
