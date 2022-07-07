class Breadcrumb {
    // When new instance is created, breadcrumbs will be generated automatically.
    constructor(id, categories, product) {
        // Breadcrumb objects that's pushed
        this.breadcrumbs = [];
        // Create the breadcrumb
        this.createBreadcrumbs(id, categories, product);
    }

    /**
     * @desc Gets the parent category name of the category id provided.
     * @param {String} id - ID that is being searched
     * @param {Array} categories - Array that has all the categories stored
     * @return {String} ID of the parent category
     */
    getParentCategory(id, categories) {
        return categories.find((el) => el.id == id).parent_category_id;
    }

    /**
     * @desc Converts ID to Name: mens-clothing -> Mens Clothing.
     * @param {String} id - ID that is being searched
     * @return {String} Name of the category
     */
    convertIDtoName(id) {
        return id
            .split('-')
            .map((el) => el.charAt(0).toUpperCase() + el.slice(1))
            .join(' ');
    }

    /**
     * @desc Pushes breadcrumb objects into breadcrumbs property of this class.
     * @param {String} crumbType - type of post type that will be added to breadcrumb.
     * @param {String} id - ID of the post type object.
     * @return {undefined}
     */
    addBreadcrumb(crumbType = 'home', id = undefined, product = undefined) {
        let crumb;

        if (product) {
            const { id, name } = product;

            crumb = {
                id,
                name,
                url: `/${crumbType}/${id}`,
            };
        } else {
            // Check if its crumb for home page
            if (crumbType.toLowerCase() == 'home') {
                crumb = {
                    id: 'home',
                    name: 'Home',
                    url: `/`,
                };
            } else {
                crumb = {
                    id,
                    name: this.convertIDtoName(id),
                    url: `/${crumbType}/${id}`,
                };
            }
        }

        // Add crumb to the stack
        this.breadcrumbs.unshift(crumb);
    }

    /**
     * @desc Creates the breadcrumbs according to given id, by recursively tracing the parent categories.
     * @param {String} id - ID of the current category.
     * @param {String} categories - All the categories that exist.
     * @return {undefined}
     */
    createBreadcrumbs(id, categories, product = undefined) {
        if (product) {
            this.addBreadcrumb('products', id, product);
        }
        // Add requested category into breadcrumb
        this.addBreadcrumb('categories', id);

        // Get parent of the requested category
        let nextParent = this.getParentCategory(id, categories);

        // Iterate until we reach to root category
        while (nextParent !== 'root') {
            // Add parent to breadcrumb
            this.addBreadcrumb('categories', nextParent);

            // Get next category
            nextParent = this.getParentCategory(nextParent, categories);
        }

        // Add 'Home' to breadcrumb
        this.addBreadcrumb();
    }
}

module.exports = Breadcrumb;
