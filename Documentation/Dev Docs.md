# Developer Documentation
## Table of Contents
- [Setting Up Your Local Repo](#setting-up-your-local-repo)
- [Contributions](#contributions)
- [Writing Code for the Admin Side](#writing-code-for-the-admin-side)
- [Writing Code for the Customer Side](#writing-code-for-the-customer-side)
- [Using the Database API](#using-the-database-api)
  * [GET Requests](#get-requests)
    + [Get All Products Belonging to a User](#get-all-products-belonging-to-a-user)
    + [Get the ID of a User](#get-the-id-of-a-user)
    + [Get All the Variations of a Product](#get-all-the-variations-of-a-product)
    + [Get All the Variation Groups of a Product](#get-all-the-variation-groups-of-a-product)
    + [Get All the Blockers of a Variation](#get-all-the-blockers-of-a-variation)
  * [POST Requests](#post-requests)
    + [Add/Update a Product](#addupdate-a-product)
    + [Add/Update a Variation Group](#addupdate-a-variation-group)
    + [Add/Update a Variation](#addupdate-a-variation)
    + [Add a Variation Blocker (If It Does Not Already Exist)](#add-a-variation-blocker-if-it-does-not-already-exist)
  * [DELETE Requests](#delete-requests)
    + [Delete a Product](#delete-a-product)
    + [Delete a Variation Group](#delete-a-variation-group)
    + [Delete a Variation](#delete-a-variation)
    + [Delete a Variation Blocker](#delete-a-variation-blocker)
<br><br><br>

## Setting Up Your Local Repo
1. Clone this repository

2. Create a Shopify partner account and development store to deploy the app to

3. [Install the Shopify CLI, Node.js, npm, and Ruby](https://shopify.dev/apps/tools/cli/installation)

4. Run `shopify login` to login to your Shopify partner account

5. Create an account on ngrok to obtain an auth token

6. Run `shopify app tunnel auth <token>` filling in the `<token>` obtained from ngrok

7. Setup a MySQL server on the same machine running the app.

8. Run the SQL files located in `better_than_sum/SQL`. Create a database named `G4db` and a user that can access it

9. Copy the `better_than_sum/.env.example` file to `better_than-sum/.env`
10. Fill in the following fields in `better_than_sum/.env` with the proper information
  ```js
  SHOPIFY_API_KEY=// Enter your shopify API key here
  SHOPIFY_API_SECRET=// Enter your secret shopify api key here
  HOST=// Enter your NGROK tunnel url here
  SHOP=// Enter the domain of your shop here
  SCOPES=write_products,write_customers,write_draft_orders // Do not modify this line
  MYSQL_USER=// Enter the username for your MySQL database here
  MYSQL_PASS=// Enter the password for your MySQL database here
  ```

11. `cd` into the `better_than_sum`
12. run `npm install`
13. run `shopify app serve`

14. Open the URL provided by the terminal to install the app on your development store
<br><br><br>

## Contributions
Create a new branch specific to the feature being added.

Write the code, then when ready, issue a pull request to the Testing branch.

Once all code in Testing is ready for production, it will be merged into Main.
<br><br><br>

## Writing Code for the Admin Side
The admin-side of the app is accessible by staff members of any store with this app installed. 
This is where users will access their product variations and modify details.

All the code related to the Admin Side is located within `better_than_sum/pages/AdminApp`

`App.js` is the starting point of the program and is responsible for initializing and maintaining the overall state of the program.

Further functionality is delegated to various AppStates that extend the class located in `AppState.js`, along with any other classes added.

This functionality can be viewed on a store via logging in using a staff account, navigating to Apps using the list on the left-hand side, and selecting better_than_sum. 

The app must be running in order to use it. To start the app, run `shopify app serve` from within the `better_than_sum` folder.
<br><br><br>

## Writing Code for the Customer Side
The customer-side of the app is accessible by anyone visiting the front end of the store. 
This is where users will be able to select a specific variation of a product and see their updated cost.

This functionality is delegated to the app extension via code blocks located in `better_than_sum/theme-app-extension`

The `.liquid` files within the `blocks` folder each describe an element that can be added by a staff member when editing the layout of the store.
A code block is able to display/use custom HTML, CSS, and JS to add functionality to a store page.

Code blocks are statically loaded onto a webpage, so changes must be pushed for them to take effect. Run `shopify extension push` from within `better_than_sum/theme-app-extension` to upload any changes made.
<br><br><br>

## Using the Database API
### GET Requests
The API has multiple sets of information that can be retrieved via GET requests.

To issue a GET request, send an HTTP request to `/database/` with the requested information inside the query parameters.
#### Get All Products Belonging to a User
- `request=userProducts`
- `userID=INTEGER`
#### Get the ID of a User
- `request=userID`
- `userName=STRING`
#### Get All the Variations of a Product
- `request=productVariations`
- `productID=INTEGER`
#### Get All the Variation Groups of a Product
- `request=productVariationGroups`
- `productID=INTEGER`
#### Get All the Blockers of a Variation
- `request=variationBlockers`
- `variationID=INTEGER`

### POST Requests
The API can add items to the database via POST requests.

To issue a POST request, send an HTTP request to `/database/` with the content being of JSON type.
#### Add/Update a Product
```js
{
  "operation":"product",
  "productID":INTEGER, // Optional, used if updating a product, empty if adding
  "baseCost":INTEGER, // Baseline cost of product, in cents
  "name":STRING,
  "owningUser":INTEGER // ID of user who owns the product
}
```
#### Add/Update a Variation Group
```js
{
  "operation":"variationGroup",
  "groupID":INTEGER, // Optional, used if updating a group, empty if adding
  "name":STRING,
  "owningProduct":INTEGER // ID of product who owns the group
}
```
#### Add/Update a Variation
```js
{
  "operation":"variation",
  "variationID":INTEGER, // Optional, used if updating a variation, empty if adding
  "name":STRING,
  "addedCost":INTEGER, // Cost this variation adds the the base product, in cents
  "owningGroup":INTEGER // ID of variation group who owns the variation
}
```
#### Add a Variation Blocker (If It Does Not Already Exist)
```js
{
  "operation":"variationBlocker",
  "blockerAID":INTEGER,
  "blockerBID":INTEGER
  // The IDs of the blockers can be in any order, since a blocker is reflexive
}
```
### DELETE Requests
The API can remove items from the database via DELETE requests.

To issue a DELETE request, send an HTTP request to `/database/` with the requested delete in the query parameters.
#### Delete a Product
- `operation=product`
- `productID=INTEGER`
#### Delete a Variation Group
- `operation=variationGroup`
- `groupID=INTEGER`
#### Delete a Variation
- `operation=variation`
- `variationID=INTEGER`
#### Delete a Variation Blocker
- `operation=variationBlocker`
- `blockerAID=INTEGER`
- `blockerBID=INTEGER`
