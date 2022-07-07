import axios from 'axios';
import { showAlert } from './alerts';

export const product = async (id, variantObj) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/products/${id}`,
            params: variantObj,
        });
    } catch (err) {
        showAlert('error', 'Something went wrong while trying to load product!');
    }
};
