'use strict';

import '@babel/polyfill';
import { login, signup, logout } from './login';
import { product } from './productVariant';
import { addToCart, changeItemQuantity, removeItem } from './cart';

const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelectorAll('.nav--logout');

const productVariant = document.querySelector('.variations-form');
const productImages = document.querySelectorAll('.product-image img');

const checkedVariants = document.querySelectorAll(
    'input[name="color"]:checked, input[name="size"]:checked, input[name="accessorySize"]:checked'
);
const variantInputs = document.querySelectorAll('.variations-form input[type="radio"]');

const btnCart = document.querySelector('.btn-cart');
const cartQtyButtons = document.querySelectorAll('.quantity .plus-btn, .quantity .minus-btn');

const quantityInput = document.querySelector('.quantity input');

const removeCartBtn = document.querySelectorAll('.delete-btn');

const insertURLParam = (key, value) => {
    if (history.pushState) {
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set(key, value);
        let newurl =
            window.location.protocol +
            '//' +
            window.location.host +
            window.location.pathname +
            '?' +
            searchParams.toString();
        window.history.pushState({ path: newurl }, '', newurl);
    }
};

if (loginForm)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });

if (signupForm)
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        signup(name, email, password);
    });

if (logOutBtn)
    Array.from(logOutBtn).forEach((el) => {
        el.addEventListener('click', logout);
    });

if (checkedVariants)
    checkedVariants.forEach((el) => {
        const variantObj = {};
        variantObj[el.name] = el.value;

        // Add variant queries
        for (const [key, value] of Object.entries(variantObj)) {
            insertURLParam(key, value);
        }
    });

if (variantInputs)
    variantInputs.forEach((el) => {
        el.addEventListener('change', (e) => {
            // Get product id from DOM
            const id = productVariant.classList[1].split('-')[1];

            // Add selected variant key and value
            const variantObj = {};

            // Get selected inputs
            const currentInputs = document.querySelectorAll(
                'input[name="color"]:checked, input[name="size"]:checked, input[name="accessorySize"]:checked'
            );

            // Add all inputs to variant object
            currentInputs.forEach((cur) => {
                variantObj[cur.name] = cur.value;
            });

            // Get request to product variant
            product(id, variantObj);

            // Add variant queries
            for (const [key, value] of Object.entries(variantObj)) {
                insertURLParam(key, value);
            }

            // Reload page with the queries
            document.location.reload(true);
        });
    });

if (btnCart)
    btnCart.addEventListener('click', (e) => {
        e.preventDefault();

        const variantClass = productVariant.classList[2];

        const productId = productVariant.classList[1].split('-')[1];
        const variantId = variantClass.slice(variantClass.indexOf('-') + 1);

        addToCart(productId, variantId, 1);
    });

if (cartQtyButtons)
    cartQtyButtons.forEach((el) => {
        el.addEventListener('click', (cur) => {
            cur.preventDefault();

            const button = cur.target.classList.value.split('-')[0];
            const altButton = cur.target.closest('button').classList.value.split('-')[0];

            let input = el.closest('div').querySelector('input');
            let value = parseInt(input.value);

            if (button === 'plus' || altButton === 'plus') {
                if (value < 10) {
                    value = value + 1;
                } else {
                    value = 10;
                }
            } else if (button === 'minus' || altButton === 'minus') {
                if (value > 0) {
                    value = value - 1;
                } else {
                    value = 0;
                }
            }

            input.value = value;

            const productId = cur.target.closest('.cart-item').dataset.id;
            const variantId = cur.target.closest('.cart-item').dataset.variantId;

            changeItemQuantity(productId, variantId, value);
        });
    });

if (quantityInput)
    quantityInput.addEventListener('change', (e) => {
        const productId = e.target.closest('.cart-item').dataset.id;
        const variantId = e.target.closest('.cart-item').dataset.variantId;

        changeItemQuantity(productId, variantId, e.target.value);
    });

if (removeCartBtn)
    removeCartBtn.forEach((el) => {
        el.addEventListener('click', (cur) => {
            cur.preventDefault();

            const productId = cur.target.closest('.cart-item').dataset.id;
            const variantId = cur.target.closest('.cart-item').dataset.variantId;

            changeItemQuantity(productId, variantId, 0);
        });
    });

$(document).ready(function () {
    $('.owl-carousel').owlCarousel({
        nav: false,
        items: 1,
    });

    $('.like-btn').on('click', function () {
        $(this).toggleClass('is-active');
    });
});
