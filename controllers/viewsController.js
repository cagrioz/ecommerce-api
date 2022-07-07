const catchAsync = require('../utils/catchAsync');

const productController = require('./productController');
const categoryController = require('./categoryController');
const cartController = require('./cartController');

const Breadcrumb = require('../utils/breadcrumb');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get Menu
    const { menuItems, categories } = res.locals;

    // Categories that are only sub category
    const subcategories = categories.filter((el, i, arr) => categoryController.isSubcategory(el.id, arr));

    // Render index page
    res.status(200).render('index', {
        menuItems,
        subcategories,
        btnMoreText: 'View Products',
    });
});

exports.getLogin = catchAsync(async (req, res, next) => {
    // 1) Get Menu
    const { menuItems } = res.locals;

    // Render index page
    res.status(200).render('login', {
        menuItems,
    });
});

exports.getSignup = catchAsync(async (req, res, next) => {
    // 1) Get Menu
    const { menuItems } = res.locals;

    // Render index page
    res.status(200).render('signup', {
        menuItems,
    });
});

exports.getCart = catchAsync(async (req, res, next) => {
    // 1) Get Menu
    const { menuItems } = res.locals;

    let authToken;
    if (req.cookies.token) {
        authToken = `Bearer ${req.cookies.token}`;
    }

    const cart = await cartController.fetchCart(authToken, process.env.JWT_SECRET);

    products = await cartController.fetchProductsInCart(cart.items);

    let cart_total = 0;

    products.forEach((el) => {
        cart_total += el.price * el.quantity;
    });

    // Render index page
    res.status(200).render('cart', {
        menuItems,
        cart_total,
        cartItems: products,
    });
});

exports.getCategory = catchAsync(async (req, res, next) => {
    // Destructure params
    const { id } = req.params;

    // Destructure locals
    const { menuItems, categories } = res.locals;

    // Check if category exist
    if (!categories.find((el) => el.id == id)) {
        // Send back the category not found error
        return next(new AppError('Category Not Found', 404));
    }

    // Category object
    const category = categoryController.getCategoryInfoByID(id, categories);

    // Get more button text
    const btnMoreText = category.parent_category_id === 'root' ? 'View Subcategories' : 'View Products';

    // Create breadcrumbs
    const crumbs = new Breadcrumb(id, categories);

    // If category requested is not sub category, display subcategories
    if (!categoryController.isSubcategory(id, categories)) {
        result = categoryController.getSubcategories(id, categories);

        return res.status(200).render('category', {
            menuItems,
            subcategories: result,
            crumbs: crumbs.breadcrumbs,
            category,
            btnMoreText,
        });
    }

    const products = await productController.fetchProductByCategoryID(id, process.env.JWT_SECRET);

    return res.status(200).render('product', {
        category,
        menuItems,
        products,
        crumbs: crumbs.breadcrumbs,
    });
});

exports.getParentCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { menuItems, categories } = res.locals;

    const crumbs = new Breadcrumb(id, categories);

    let subcategories = await categoryController.fetchCategoryByParentID(id, process.env.JWT_SECRET);

    res.status(200).render('category', {
        menuItems,
        categories: subcategories,
        crumbs: crumbs.breadcrumbs,
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    // Destructure params
    const { id } = req.params;
    const { color, size, accessorySize } = req.query;

    // Destructure locals
    const { menuItems, categories } = res.locals;

    // Get product
    const products = await productController.fetchProductByProductID(id, process.env.JWT_SECRET);

    // Make sure that product returned
    if (products.length < 1) {
        return next(new AppError('Product with this ID is not exist!', 404));
    } else {
        // Destructure from the array
        const [product_data, ...rest] = products;

        // Create breadcrumbs
        const crumbs = new Breadcrumb(product_data.primary_category_id, categories, product_data);

        // Sort variant array of objects
        productController.sortProductVariants(product_data);

        const product = productController.getProductVariantByAttr(product_data, color, size, accessorySize);

        return res.status(200).render('single', {
            menuItems,
            product,
            crumbs: crumbs.breadcrumbs,
        });
    }
});
