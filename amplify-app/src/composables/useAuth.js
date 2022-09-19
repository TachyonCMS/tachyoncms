import { ref } from "vue";

import AmplifyCognito from "./auth_strategies/useAmplifyCognito.js";

// USER Store - info about the auth user
import { useUserStore } from "../stores/user";
const userStore = useUserStore();
// COLOR Store
import { useColorStore } from "../stores/color";
const colorStore = useColorStore();

import { colors } from "quasar";
const { getPaletteColor } = colors;

// Stratgies object, this does not need to be reactive
const strategies = {};

strategies.amplify = new AmplifyCognito();

console.log(strategies);

export default function useAuth() {
  const strategy = ref("amplify");

  /**
   * Sign Out
   *
   */
  const signOut = async () => {
    console.debug("Signup");
    try {
      if (strategy.value) {
        strategies[strategy.value].signOut().then(() => {
          console.log("LOGGED OUT");
          // Clear stores
          userStore.setUsername(null);
          userStore.setEmail(null);
          userStore.setTelephone(null);
          userStore.setFullname(null);

          colorStore.setPrimaryColor("#1976D2");
          colorStore.setSecondaryColor("#26A69A");
          colorStore.setAccentColor("#9C27B0");
          colorStore.setCtaColor("#F00");
          colorStore.setGlossy(false);
        });
      }
    } catch (e) {
      console.error("Error signing up user");
      console.error(e);
    }
  };

  /**
   * Sign In
   *
   * @param {*} userObject
   */
  const signIn = async (userObject) => {
    console.debug("Signin/Login");
    try {
      if (strategy.value) {
        strategies[strategy.value].signIn().then((user) => {
          if (user) {
            console.log(user);
          }
        });
      }
    } catch (e) {
      console.error("Error logging user in");
      console.error(e);
    }
  };

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
    signOut,
    signUp,
    getAuthUser
  };
}
