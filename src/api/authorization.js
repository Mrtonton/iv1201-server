const jwt = require("jsonwebtoken");
const Logger = require('./../util/logger.js');

/*
  Format of token (header: key):
  Authorization: Bearer ACCESS_TOKEN
*/

/*
  NEEDED ADDITIONS:
  Redirect the user to login if invalid token
  Add logging
  (take username and role_id from token and include it in the request
  to later be used in the coming next() function?)
*/

/**
 * Middleware to verify a token. Used before accessing pages
 * where confirmation is neeeded.
 * @param {req} req The express Request object.
 * @param {res} res The express Response object.
 * @param {next} next The next function to execute.
 */
function verifyToken(req, res, next){
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader !== "undefined"){
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
      if(err){
        console.log("Invalid token");
        return res.status(403).send("Invalid token!");
      }
      else{
        //add logging (token accepted)
        req.body.auth = authData.person;
        next();
      }
    });
  }
  else{
    return res.status(403).send("Authorization header is missing or incorrectly formatted");
  }
}

/**
 * Middleware to verify if there is a valid token in the header. Either a normal access token,
 * or a temporary "put" token used for updating the user's data like password or email when not logged in.
 * @param {req} req The express Request object.
 * @param {res} res The express Response object.
 * @param {next} next The next function to execute.
 */
function verifyUpdatePerson(req, res, next){
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader !== "undefined"){
    const token = bearerHeader.split(" ")[1];

    let authData;

    //console.log("token: " + token);
    jwt.verify(token, process.env.JWT_SECRET, (err, a1) => {
      if(err){
        jwt.verify(token, process.env.JWT_PUT_SECRET, (err2, a2) => {
          if(err2){
            return res.status(403).send("Unauthorized");
          }
          else{
            req.body.auth = a2;
            next();
          }
        });
      }
      else{
        authData = a1;
        req.body.auth = authData.person;
        next();
      }
    });
  }
  else{
    return res.status(403).send("Authorization header is missing or incorrectly formatted");
  }
}

/**
 * Middleware to verify that the user is a recruiter.
 * Used before accessing pages where recruiter rights is neeeded.
 * @param {req} req The express Request object.
 * @param {res} res The express Response object.
 * @param {next} next The next function to execute.
 */
function isRecruiter(req, res, next){
  //If user is a recruiter (role_id == 1)
  if(req.body.auth.role_id == 1){
    next();
  }
  else{ //Else user does not have right to access page.
    Logger.logMessage("Unauthorized tried to access recruiter-only content, user: \"" + req.body.auth.username + "\", with id: " + req.body.auth.role_id);
    return res.status(403).send("Unauthorized, only recruiters can access this page");
  }
}

module.exports = {
  verifyToken: verifyToken,
  verifyUpdatePerson: verifyUpdatePerson,
  isRecruiter: isRecruiter
}
