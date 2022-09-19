import { ref } from "vue";

import { Auth } from "aws-amplify";

// USER Store - info about the auth user
import { useUserStore } from "../../stores/user";
const userStore = useUserStore();

export default function useAuth() {
  const strategy = ref("aws");

  const signOut = async () => {
    console.debug("Amplify Cognito Sign out");
    try {
      await Auth.signOut();
    } catch (e) {
      console.error("Error signing out Amplify Cognito user");
      console.error(e);
    }
  };

  const signIn = async (credentials) => {
    console.debug("Amplify Cognito Sign up");
    try {
      const user = await Auth.signIn(
        credentials.username,
        credentials.password
      );
      if (user) {
        userStore.$patch({
          username: user.username,
          email: user.attributes.email,
          fullname: user.attributes.name,
          userId: user.attributes.sub,
          authenticated: true
        });

        return user;
      }
    } catch (e) {
      console.error("Error signing up Amplify Cognito user");
      console.error(e);
    }
  };

  /**
   * Get Authenticated User Info from Amplify Cognito
   *
   */
  const getAuthUser = async () => {
    return Auth.currentAuthenticatedUser()
      .then((user) => {
        return user;
      })
      .catch(() => {
        return null;
      });
  };

  const requestResetCode = async (username) => {
    console.debug("Amplify Cognito Request Reset Code");
    return Auth.forgotPassword(username)
      .then((data) => console.log(data))
      .catch((e) => {
        console.error(
          "Error requesting reset from Amplify Cognito for user: "
        ) + username;
        console.log(e);
      });

    try {
      return Auth.forgotPassword(username);
    } catch (e) {
      console.error("Error requesting reset from Amplify Cognito for user: ") +
        username;
      console.error(e);
      return false;
    }
  };

  const signUp = async (userObject) => {
    console.debug("Amplify Cognito Sign up");
    try {
    } catch (e) {
      console.error("Error signing up Amplify Cognito user");
      console.error(e);
    }
  };

  return {
    signIn,
    signOut,
    signUp,
    getAuthUser
  };
}
