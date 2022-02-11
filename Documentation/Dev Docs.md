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
