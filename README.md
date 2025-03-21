# Multi Vehicle Search Api

This is a REST api that will allow renters to find locations where they could store multiple vehicles


## Installation
To install the api in your local follow these steps:

1. Install NodeJS if its not already installed. You can install it by the `brew install node` command in your terminal (it can be on your root directory)

```
~ $ brew install node
```

2. Install NVM if its not already installed. You can install it by the `brew install nvm` command in your terminal (it can be on your root directory)

```
~ $ brew install nvm
```

3. Now that you have nvm installed, we need install nvm version then node version in the .nvmrc with the `nvm install` command

```
~ $ nvm install
```

4. Clone the multi-vehicle-search-service repo from `https://github.com/gopinathboyanapally/multi-vehicle-search-service.git`

5. On your terminal, cd to the repo.

6. Now use the `nvm use` command to use a specific version of NodeJS required by seo-admin-ui

```
    $ nvm use
```

>should output something like this

```
Found '[...your-repos-path]/[app-directory]/.nvmrc' with version <20.14.0>
Now using node v20.14.0(npm v10.7.0)
```
7. Install all the dependencies

```
~ $ npm install
```

## Running the app on localhost
1. Run `npm run start:dev` on your terminal to run the dev environment.

2. You can now see the POST endpoint running on `http://localhost:3000/`

3. The production AWS EC2 instance API Url is the `http://18.236.156.8:3000/`

## Testing
1. Now once everything is setup, You can use the Postman software to test the API.

2. Search for the locations to store multiple vehicles
```
    POST http://localhost:3000/
    [
        {
            "length": 10,
            "quantity": 1
        },
        {
            "length": 20,
            "quantity": 2
        },
        {
            "length": 25,
            "quantity": 1
        }
    ]
```