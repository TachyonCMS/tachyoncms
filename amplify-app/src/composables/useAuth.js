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
          logger.log(data);
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
          logger.info(data);
          logger.info("Auto Sign In after Sign Up succeeded");
          //patchUser(data.payload.data);
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
      const user = await Auth.signIn(username, password);
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
            logger.info(user);
            // patchUser(user.payload.data);
            //router.push("/auth/login");
          })
          .catch((e) => {
            logger.error(e);
          });
      } else {
        console.log(user);
        patchUser(user);
      }
    } catch (error) {
      logger.error("error signing in:", error);
      let msg = "Error signing in";
      if (
        error.message.indexOf(
          "Cannot read properties of null (reading 'username')"
        ) !== -1
      ) {
        msg = "You must provide a username";
      } else if (
        error.message.indexOf(
          "Custom auth lambda trigger is not configured"
        ) !== -1
      ) {
        msg = "You must provide a password of 12 characters or more";
      } else if (error.message.indexOf("User does not exist") !== -1) {
        console.log("throw this");
        msg = "The username was not found";
      } else if (
        error.message.indexOf("Incorrect username or password") !== -1
      ) {
        console.log("throw this");
        msg = "Incorrect username or password";
      }
      throw msg;
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
          enabled: false
        }
      };
      if (validateTelephone(userObj.telephone)) {
        awsUserObj.attributes.phone_number = userObj.telephone; // optional - E.164 number convention
      }
      const { user } = await Auth.signUp(awsUserObj);

      if (user) {
        userStore.$patch({
          username: user.username,
          email: userObj.email,
          fullname: userObj.fullname,
          authenticated: false
        });
      }
    } catch (error) {
      logger.info("error signing up:", error);
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

  async function confirmSignUp(username, code) {
    try {
      logger.debug(username, code);
      const result = await Auth.confirmSignUp(username, code);
      return result;
    } catch (error) {
      logger.error("error confirming signup:", error);
      let msg = "Confirmation failed";
      if (error.message.indexOf("Current status is CONFIRMED") !== -1) {
        msg = "The username has already been confirmed";
      } else if (
        error.message.indexOf("Invalid verification code provided") !== -1
      ) {
        msg = "The confirmation code is incorrect";
      } else if (
        error.message.indexOf("Username/client id combination not found") !== -1
      ) {
        msg = "The username was not found";
      }
      throw msg;
    }
  }

  async function resendConfirmationCode(username) {
    try {
      await Auth.resendSignUp(username);
      console.log("code resent successfully");
    } catch (error) {
      console.log("error resending code: ", error);
      let msg = "Resending the code failed";
      if (error.name == "UserNotFoundException") {
        msg = "The username was not found";
      } else if (error.message.indexOf("User is already confirmed") !== -1) {
        msg = "The username is already confirmed";
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
      logger.error("error requesting reset code:", error.name);
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
      logger.info(result);
    } catch (error) {
      logger.error("error resetting password:", error);
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
      logger.info(userData);
      return userData;
    } catch (error) {
      logger.error("error getting current user:", error);
    }
  }

  async function changePassword(userObj, currentPassword, NewPassword) {
    try {
      const result = await Auth.changePassword(
        userObj,
        currentPassword,
        NewPassword
      );
      logger.info(result);
    } catch (error) {
      logger.error("error changing password:", error);
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

  function obscureEmail(email) {
    const parts = email.split("@");
    const safeParts = parts.map((part) => {
      const len = part.length;
      const startStr = part.substr(0, 3);
      return startStr.padEnd(len, "*");
    });
    console.log(safeParts);
    return safeParts.join("@");
  }

  return {
    trackAuth,
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    resendConfirmationCode,
    requestResetCode,
    submitResetCode,
    changePassword,
    getCurrentUser,
    validatePassword,
    validateEmail,
    obscureEmail
  };
}
