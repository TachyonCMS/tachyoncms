/**
 * Implements AWS Amplify Cognito Auth
 */
import { Auth, Hub, Logger } from "aws-amplify";
const logger = new Logger("AuthLogger");

import { computed } from "vue";

// USER Store - info about the auth user
import { useUserStore } from "../stores/user";
const userStore = useUserStore();

export default function useAuth() {
  const trackAuth = () => {
    const authListener = (data) => {
      switch (data.payload.event) {
        case "signIn":
          logger.info("User signed in");
          patchUser(data.payload.data);
          break;
        case "signUp":
          logger.info("user signed up");
          console.log(data);
          //patchUser(data.payload.data);
          break;
        case "signOut":
          logger.info("user signed out");
          userStore.$patch({
            username: null,
            email: null,
            fullname: null,
            userId: null,
            authenticated: false
          });
          break;
        case "signIn_failure":
          logger.error("user sign in failed");
          break;
        case "tokenRefresh":
          logger.info("token refresh succeeded");
          break;
        case "tokenRefresh_failure":
          logger.error("token refresh failed");
          break;
        case "autoSignIn":
          logger.info("Auto Sign In after Sign Up succeeded");
          patchUser(data.payload.data);
          break;
        case "autoSignIn_failure":
          logger.error("Auto Sign In after Sign Up failed");
          break;
        case "configured":
          logger.info("the Auth module is configured");
      }
    };

    Hub.listen("auth", authListener);
  };

  function patchUser(data) {
    userStore.$patch({
      username: data.username,
      email: data.attributes.email,
      fullname: data.attributes.name,
      userId: data.attributes.sub,
      authenticated: true
    });
  }

  async function signIn(username, password) {
    try {
      Auth.signIn(username, password)
        .then((user) => {
          console.info(user);
          if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
            const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
            Auth.completeNewPassword(
              user, // the Cognito User Object
              newPassword, // the new password
              // OPTIONAL, the required attributes
              {
                email: "xxxx@example.com",
                phone_number: "1234567890"
              }
            )
              .then((user) => {
                // at this time the user is logged in if no MFA required
                console.info(user);
                patchUser(user.payload.data);
              })
              .catch((e) => {
                console.error(e);
              });
          } else {
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (error) {
      console.error(e);
      logger.error("error signing in:", error);
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
      userStore.$patch({
        username: null,
        email: null,
        fullname: null,
        userId: null,
        authenticated: false
      });
    } catch (error) {
      logger.log("error signing out: ", error);
    }
  }

  async function signUp(userObj) {
    try {
      const awsUserObj = {
        username: userObj.username,
        password: userObj.password,
        attributes: {
          email: userObj.email,
          name: userObj.commonName
          // other custom attributes
        },
        autoSignIn: {
          // optional - enables auto sign in after user is confirmed
          enabled: true
        }
      };
      if (validateTelephone(userObj.telephone)) {
        awsUserObj.attributes.phone_number = userObj.telephone; // optional - E.164 number convention
      }
      const { user } = await Auth.signUp(awsUserObj);
      console.info(user);
    } catch (error) {
      console.info("error signing up:", error);
      let msg = "Error creating account";
      switch (error.name) {
        case "InvalidParameterException":
        case "InvalidPasswordException":
          msg = "The password is invalid, it must be at least 12 characters.";
          break;
        case "UsernameExistsException":
          msg = "The username is not available.";
      }
      throw msg;
    }
  }

  async function requestResetCode(username) {
    try {
      const result = await Auth.forgotPassword(username);
      userStore.setUsername(username);
      return username;
    } catch (error) {
      console.error("error requesting reset code:", error.name);
      if (error.name === "UserNotFoundException") {
        throw "Username not found";
      }
      throw "Error requesting password reset";
    }
  }

  async function submitResetCode(username, code, NewPassword) {
    try {
      const result = await Auth.forgotPasswordSubmit(
        username,
        code,
        NewPassword
      );
      console.info(result);
    } catch (error) {
      console.error("error resetting password:", error);
      let msg = "Password reset failed";
      switch (error.name) {
        case "InvalidParameterException":
        case "InvalidPasswordException":
          msg =
            "The new password is invalid, it must be at least 12 characters.";
          break;
        case "NotAuthorizedException":
          msg = "Incorrect reset code";
      }
      throw msg;
    }
  }

  async function getCurrentUser() {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      console.info(userData);
      return userData;
    } catch (error) {
      console.error("error getting current user:", error);
    }
  }

  async function changePassword(userObj, currentPassword, NewPassword) {
    try {
      const result = await Auth.changePassword(
        userObj,
        currentPassword,
        NewPassword
      );
      console.info(result);
    } catch (error) {
      console.error("error changing password:", error);
      let msg = "Password change failed";
      switch (error.name) {
        case "InvalidParameterException":
        case "InvalidPasswordException":
          msg =
            "The new password is invalid, it must be at least 12 characters.";
          break;
        case "NotAuthorizedException":
          msg = "Incorrect current password";
      }
      throw msg;
    }
  }

  function validatePassword(password) {
    return password && password.length >= 12 ? true : false;
  }

  function validateEmail(email) {
    logger.info("Validate email");
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateTelephone(telephone) {
    logger.info("Validate telephone");
    return /^\+[1-9]\d{10,14}$/.test(telephone);
  }

  return {
    trackAuth,
    signIn,
    signOut,
    signUp,
    requestResetCode,
    submitResetCode,
    changePassword,
    getCurrentUser,
    validatePassword,
    validateEmail
  };
}
