import { ref } from "vue";

import { Auth } from "aws-amplify";

export default function useAuth() {
  const strategy = ref("aws");

  // Get all flows, @todo add pagination
  const signOut = async () => {
    console.debug("Amplify Cognito Sign out");
    await Auth.signOut();
    try {
    } catch (e) {
      console.error("Error signing out Amplify Cognito user");
      console.error(e);
    }
  };

  // Get all flows, @todo add pagination
  const signUp = async (userObject) => {
    console.debug("Amplify Cognito Sign up");
    try {
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
    console.debug("Get Amplify Cognito auth user info");
    return Auth.currentAuthenticatedUser()
      .then((user) => {
        return user;
      })
      .catch(() => {
        return null;
      });
    try {
    } catch (e) {
      console.error("Error getting Amplify Cognito user info");
      console.error(e);
    }
  };

  return {
    signOut,
    signUp,
    getAuthUser
  };
}
