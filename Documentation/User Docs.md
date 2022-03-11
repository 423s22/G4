## Shopify Page
[https://jacob-esof423.myshopify.com/](https://jacob-esof423.myshopify.com/)

## Requesting an Install Link
In order to install Better Than Sum, request an install link via the [Contact Us](https://jacob-esof423.myshopify.com/pages/contact) page. 
Include the URL of your Shopify store, and we will send the install link as soon as possible.

## Using the Install Link
Follow the provided link and the instructions displayed to install the app onto your own store. 
Once installed, it will be available in your store's dashboard under the "Apps" section. 

## Using the Application
All of the settings are managed via the App within the Admin Page of your store.

Currently, when the app is opened, a list of all the products appears, with a button that can be clicked to add a new random product to the list.
Clicking this button will dynamically update the list in real-time with the newly added product. 
A note also appears below the button indicating the id of the newly created product.

## Future Functionality
More functionality is planned to allow for creating fully custom variations for products loaded from Shopify's base list of products.

Users will first create their product within Shopify's base system. Within our app it can then be selected to edit its variations.

### Variations and Variation Groups
Variations are divided into groups for each product. A variation group describes the overall characteristic the variations target.
For example, one variation group may be called "Size" with individual variations for "Small", "Medium", and "Large".

Variations in each group are mutually exclusive, so shoppers will only be able to select "Small" or "Large", but not both.

Variations can add extra cost onto the base product cost when selected. The total cost for a product will be the sum of its 
base cost and the addition costs from each selected variation. 

### Variation Blockers
Variation blockers allow for excluding variations based on the selection of other variations. 

For example, consider two groups "Size" and "Color" with variations "Small", "Large", and "Red", "Blue".
A variation blocker could be created between "Small" and "Blue" to designate that the product cannot be purchesed in a "Small Blue" variant.

This relationship is reflexive, so if "Small" blocks "Blue", then "Blue" also blocks "Small".
