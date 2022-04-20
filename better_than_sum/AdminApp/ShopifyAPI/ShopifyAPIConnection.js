export default class ShopifyApiConnection {

    /**
     * Creates a new connection to the Shopify API exposed by the server
     * @param {string} shopName the name of the shop used for requests
     * @param {string} baseURL the url to make requests to
     */
    constructor(shopName, baseURL = null) {
        if (baseURL == null) this._baseURL = new URL(window.location.href);
        else this._baseURL = baseURL;
        this._shopName = shopName;
    }

    /**
     * 
     * @returns {Promise<any>} the list of shopify-based products owned by the store
     */
    async getProductsJSON() {
        let url = new URL(this._baseURL);
        url.pathname += "products/"
        if (url.searchParams.get("shop") == "") {
            url.searchParams.append("shop", this._shopName);
        }

        let promise = new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    resolve(JSON.parse(req.responseText));
                }
            };

            req.open("GET", url.toString());
            req.send();
        });

        return promise;
    }


}