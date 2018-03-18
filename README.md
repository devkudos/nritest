## Getting Started

This NRI Test#2 solution use `angular-seed` as boilerplate.

### Install Dependencies

```
npm install
```

### Run the Application

```
npm start
```

Now browse to the app at [`localhost:8000/`][local-app-url].

## Directory Layout

```
app/                    --> all of the source files for the application
  assets/               --> all app specific static files
  bower_components/     --> all bower_components
  components/           --> all app specific modules    
    accountdetail/      --> accountdetail related components
    home/               --> home related components
    login/              --> login related components
    profile/            --> profile related components
    register/           --> register related components
    topnav/             --> topnav related components
    home/               --> home related components
  config/               --> config related files
      api.js            --> api config file
  app.js                --> main application module
  index.html            --> app layout file (the main html template file of the app)
```
### Running the App during Development

The `angular-seed` project comes preconfigured with a local development web server. It is a Node.js
tool called [http-server][http-server]. You can start this web server with `npm start`, but you may
choose to install the tool globally:

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by running:

```
http-server -a localhost -p 8000
```