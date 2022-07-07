class Category {
    constructor(id, name, parent_category_id, page_title, page_description, image) {
        this.id = id;
        this.name = name;
        this.parent_category_id = parent_category_id;
        this.page_title = page_title;
        this.page_description = page_description;
        this.image = image;
    }
}

module.exports = Category;
