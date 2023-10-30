class ProductFilter extends HTMLElement {
    constructor() {
        super();

        // Main Elements
        const drawerButton = this.querySelector(".pfilter-button");
        const drawerElement = this.querySelector(".pfilter-drawer");
        const drawerCloseButton = drawerElement.querySelector(
            ".pfilter-drawer-close"
        );
        const productSection = document.getElementById("product-grid");
        const filterForm = this.querySelector("form");

        this.toggleDrawer = () => {
            drawerElement.toggleAttribute("open");
        };

        this.closeDrawer = () => {
            drawerElement.removeAttribute("open");
        };

        // Drawer functionalities
        drawerButton.addEventListener("click", this.toggleDrawer);
        drawerCloseButton.addEventListener("click", this.closeDrawer);
        drawerElement.addEventListener("click", (ev) => {
            // Close drawer only if clicked on backdrop
            if (ev.target === drawerElement) {
                this.closeDrawer();
            }
        });

        // Form submit
        filterForm.addEventListener("submit", (ev) => {
            ev.preventDefault();
            const queryString = this.getUrlByFormData(ev.target);
            this.showLoading();
            this.fetchSection(productSection.dataset.id, queryString)
                .then(() => {
                    this.updateUrl(queryString);
                    this.closeDrawer();
                })
                .finally(() => {
                    this.hideLoading();
                });
        });
    }

    /**
     * Generate url query string from form elements
     *
     * @param {HTMLFormElement} form
     * @returns {string}
     */
    getUrlByFormData(form) {
        const queryString = new URLSearchParams(new FormData(form)).toString();
        return queryString;
    }

    /**
     * Fetch and render specific section from the server
     *
     * @param {string} sectionId
     * @param {string} queryString
     * @returns {Promise}
     */
    fetchSection(sectionId, queryString) {
        const url = `${window.location.pathname}?section_id=${sectionId}&${queryString}`;
        const promise = new Promise((resolve) => {
            fetch(url)
                .then((response) => response.text())
                .then((response) => {
                    const dom = this.createDOMFromString(response);
                    this.renderProductSection(dom);
                    this.renderProductCount(dom);
                    this.renderActiveFilters(dom);
                    resolve();
                });
        });

        return promise;
    }

    /**
     * Convert string to a real DOM
     *
     * @param {string} string
     * @returns {Document}
     */
    createDOMFromString(string) {
        const dom = new DOMParser().parseFromString(string, "text/html");
        return dom;
    }

    /**
     * Replace proper elements from input dom to the product section
     * include product grid and the pagination
     *
     * @param {Document} dom
     */
    renderProductSection(dom) {
        const productSection =
            document.getElementById("product-grid").parentNode;

        const productContent =
            this.provideImageLazyLoad(dom).getElementById("product-grid");

        productSection.innerHTML = productContent.parentNode.innerHTML;
    }

    /**
     * Add lazy load attribute to product images
     *
     * @param {Document} dom
     */
    provideImageLazyLoad(dom) {
        dom.getElementById("product-grid")
            .querySelectorAll("img")
            .forEach((img) => {
                img.setAttribute("loading", "lazy");
            });

        return dom;
    }

    /**
     * Update product counter from input dom
     * also apply its entrance animation
     *
     * @param {Document} dom
     */
    renderProductCount(dom) {
        const productFilterElement = dom.getElementById("product-filter");
        this.querySelector(".pfilter-count").outerHTML =
            productFilterElement.querySelector(".pfilter-count").outerHTML;
    }

    /**
     * Replace active filter pills with newly applied filters
     *
     * @param {Document} dom
     */
    renderActiveFilters(dom) {
        const productFilterElement = dom.getElementById("product-filter");
        this.querySelector(".pfilter-applied-list").innerHTML =
            productFilterElement.querySelector(
                ".pfilter-applied-list"
            ).innerHTML;
    }

    /**
     * Update browser url with new filters
     *
     * @param {string} queryString
     */
    updateUrl(queryString) {
        history.pushState(
            { queryString },
            "",
            `${window.location.pathname}${
                queryString && "?".concat(queryString)
            }`
        );
    }

    showLoading() {
        const productSection = document.getElementById("product-grid");
        productSection.parentNode.classList.add("loading");
    }

    hideLoading() {
        const productSection = document.getElementById("product-grid");
        productSection.parentNode.classList.remove("loading");
    }
}

customElements.define("product-filter", ProductFilter);
