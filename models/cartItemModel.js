const Product = require('./productModel');

class CartItem extends Product {
    constructor(
        id,
        variant_id,
        name,
        color,
        colorName,
        size,
        accessorySize,
        accSizeName,
        cur,
        price,
        imgs,
        short_desc,
        long_desc,
        var_attr,
        qty
    ) {
        super(
            id,
            variant_id,
            name,
            color,
            colorName,
            size,
            accessorySize,
            accSizeName,
            cur,
            price,
            imgs,
            short_desc,
            long_desc,
            var_attr
        );
        this.quantity = qty;
    }
}

module.exports = CartItem;
