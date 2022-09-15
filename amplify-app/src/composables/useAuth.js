import { ref } from "vue";

import AmplifyCognito from "./auth_strategies/useAmplifyCognito.js";

// Stratgies object, this does not need to be reactive
const strategies = {};

strategies.amplify = new AmplifyCognito();

console.log(strategies);

export default function useAuth() {
  const strategy = ref("amplify");

  /**
   * Sign Up
   *
   * @param {*} userObject
   */
  const signUp = async (userObject) => {
    console.debug("Signup");
    try {
      if (strategy.value) {
        strategies[strategy.value].signUp().then((user) => {
          if (user) {
            console.log(user);
          }
        });
      }
    } catch (e) {
      console.error("Error signing up user");
      console.error(e);
    }
  };

  /**
   * Get Authenticated User Info
   *
   */
  const getAuthUser = async () => {
    console.debug("Get auth user info");
    try {
      console.log(strategies);
      return strategies[strategy.value].getAuthUser().then((user) => {
        console.log(user);
        return user;
      });
    } catch (e) {
      console.error("Error getting user info");
      console.error(e);
      return null;
    }
  };

  return {
    signUp,
    getAuthUser
  };
}
