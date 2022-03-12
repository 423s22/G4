## Setting Up Your Local Repository
The GitHub Repository is located at: [https://github.com/423s22/G4](https://github.com/423s22/G4)

1. Clone the repository at [https://github.com/423s22/G4](https://github.com/423s22/G4) to your local machine
2. Create a Shopify partner account and development store to deploy the app to
3. Install the Shopify CLI, Node.js, npm, and Ruby
4. Run `shopify login` to login to your Shopify partner account
5. Create an account on ngrok to obtain an auth token
6. Run `shopify app tunnel auth <token>` filling in the `<token>` obtained from ngrok
7. `cd` into the `better_that_sum` and `run shopify app serve`
8. Open the URL provided by the terminal to install the app on your development store

## Contributing to the Repository
1. Create a new branch of the repository specific to the changes you intend to implement
2. Write the code to implement the feature
3. Issue a Pull Request to the Testing branch. Once accepted, the changes will be in effect on that branch, and once fully tested, will be merged into Main

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
