# TachyonCMS - Storage API

The Storage API is Node application that exposes an API to manage TachyonCMS files.

It is designed to work seamlessly with the TachyonCMS Web App, but can work with any REST client.
A number of Postman collections will help explain and test the API.

## Use Cases

The primary use case is using the cameras and microphones on mobile devices to capture unlimited amounts of static and streaming content directly into the CMS.

* No cumbersome uploads or transfers are needed
* Assets available in branch
* Assets gets released with content, and not sooner.

## Running the Storage API

### Create an empty directory

You will need to store your TachyonCMS files somewhere.
It is recommended to create a new directory in a git repo.

```bash
mkdir ~/TachyonCMS
```
### Start the node server

You need to pass in the directory you created above.

```bash
 node ./server --contentDataRoot ~/TachyonCMS
 ```

You should see output similar to this:

```bash
Managing content in /home/brian/TachyonCMS
Local Content Server is live on port: 3333
http://localhost:3333
```

Visiting the `http://localhost:3333` site doesn't so much since it is an API server and lacks any sort of UI.
 
### Testing the API

Use the Postman tests. We have a simple one to start with but we love Postman and will create much more comprehensive collections.

https://github.com/TachyonCMS/storage-api/blob/main/postman/StorageAPI_Test_Collection.postman_collection.json

Open the collection in Postman and work your way from top to bottom.
You will need an environment variable of "server_url" = "http://localhost:3333".
If you are running your Storage API on a port other than 3333 you will need to update the port number.

### Developing the code

#### Nodemon weirdness 

Passing the `contentDataRoot` in from the command line breaks `nodemon`.

While I find a fix you will need to hardcode the value and comment out the checks in `lib.js`

Original:

```javascript
let contentDataRoot;

if (contentDataRootIx > -1) {
  const contentDataRootIn = process.argv[contentDataRootIx + 1];
  contentDataRoot = path.resolve(contentDataRootIn);
}
```

becomes:

```javascript
let contentDataRoot = ~/TachyonCMS;


//if (contentDataRootIx > -1) {
//  const contentDataRootIn = process.argv[contentDataRootIx + 1];
//  contentDataRoot = path.resolve(contentDataRootIn);
//}
```
