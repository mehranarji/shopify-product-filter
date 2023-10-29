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

    getUrlByFormData(form) {
        const queryString = new URLSearchParams(new FormData(form)).toString();
        return queryString;
    }

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

    createDOMFromString(string) {
        const dom = new DOMParser().parseFromString(string, "text/html");
        return dom;
    }

    renderProductSection(dom) {
        const productSection =
            document.getElementById("product-grid").parentNode;
        productSection.innerHTML =
            dom.getElementById("product-grid").parentNode.innerHTML;
    }

    renderProductCount(dom) {
        const productFilterElement = dom.getElementById("product-filter");
        this.querySelector(".pfilter-count").outerHTML =
            productFilterElement.querySelector(".pfilter-count").outerHTML;
    }

    renderActiveFilters(dom) {
        const productFilterElement = dom.getElementById("product-filter");
        this.querySelector(".pfilter-applied-list").innerHTML =
            productFilterElement.querySelector(
                ".pfilter-applied-list"
            ).innerHTML;
    }

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
