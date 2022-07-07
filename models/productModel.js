class Product {
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
        var_attr
    ) {
        this.id = id;
        this.variant_id = variant_id;
        this.name = name;
        this.color = color;
        this.colorName = colorName;
        this.size = size;
        this.accessorySize = accessorySize;
        this.accSizeName = accSizeName;
        this.currency = cur;
        this.price = price;
        this.images = imgs;
        this.short_description = short_desc;
        this.long_description = long_desc;
        this.variation_attributes = var_attr;
        this.stockStatus = price > 0 ? true : false;
    }
}

module.exports = Product;
