class ProductFilter extends HTMLElement {
    constructor() {
        super();

        const button = this.querySelector(".pfilter-button");
        const drawer = this.querySelector(".pfilter-drawer");

        this.toggleDrawer = () => {
            drawer.toggleAttribute('open');
        }

        this.closeDrawer = () => {
            drawer.removeAttribute('open');
        }

        button.addEventListener("click", this.toggleDrawer);

        drawer.querySelector('.pfilter-drawer-close').addEventListener('click', this.closeDrawer);
        drawer.addEventListener('click', (ev) => {
            if (ev.target === drawer) {
                this.closeDrawer();
            }
        });
    }
    
}

customElements.define("product-filter", ProductFilter);
