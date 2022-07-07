import axios from 'axios';
import { showAlert } from './alerts';

export const addToCart = async (productId, variantId, quantity) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/cart/addItem',
            data: {
                productId,
                variantId,
                quantity,
            },
        });

        if (res.statusText === 'Created') {
            showAlert('success', 'Item has been added to cart! Redirecting...');

            window.setTimeout(() => {
                location.assign('/cart');
            }, 50);
        }
    } catch (err) {
        showAlert('error', 'Something went wrong, please try again.');
    }
};

export const changeItemQuantity = async (productId, variantId, quantity) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/cart/changeItemQuantity',
            data: {
                productId,
                variantId,
                quantity,
            },
        });

        // Reload page
        document.location.reload(true);

        if (res.statusText === 'Created') {
            showAlert('success', 'Cart has been updated succesfully! Reloading...');
        }
    } catch (err) {
        showAlert('error', 'Something went wrong, please try again.');
    }
};

export const removeItem = async (productId, variantId) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: '/api/cart/removeItem',
            data: {
                productId,
                variantId,
            },
        });

        // Reload page
        document.location.reload(true);
    } catch (err) {
        showAlert('error', 'Something went wrong, please try again.');
    }
};
