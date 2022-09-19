import { ref } from "vue";

// USER Store - info about the auth user
import { useUserStore } from "../stores/user";
const userStore = useUserStore();

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
          userStore.$patch({
            username: null,
            email: null,
            fullname: null,
            userId: null,
            authenticated: false
          });

          colorStore.$patch({
            primaryColor: "#1976D2",
            secondaryColor: "#26A69A",
            accentColor: "#9C27B0",
            ctaColor: "#F00",
            gloss: false
          });
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
  const signIn = async (credentials) => {
    console.debug("Signin/Login");
    try {
      return strategies[strategy.value].signIn(credentials).then((user) => {
        return user;
      });
    } catch (e) {
      console.error("Error Signing In");
      console.error(e);
      return null;
    }
  };

  /**
   * Sign Up
   *
   * @param {*} userObject
   */
  const signUp = async (userObject) => {
    try {
      const { user } = await Auth.signUp({
        username: userObject.username,
        password: userObject.password,
        attributes: {
          email: userObject.email, // optional
          phone_number: userObject.telephone // optional - E.164 number convention
          // other custom attributes
        },
        autoSignIn: {
          // optional - enables auto sign in after user is confirmed
          enabled: true
        }
      });
      console.log(user);
    } catch (error) {
      console.log("error signing up:", error);
    }
  };

  /**
   * Get Authenticated User Info
   *
   */
  const getAuthUser = async () => {
    console.debug("Get auth user info");
    try {
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

  const requestResetCode = async (username) => {
    console.debug("Request Reset Code");
    try {
      return strategies[strategy.value].requestResetCode().then((result) => {
        return result;
      });
    } catch (e) {
      return false;
    }
  };

  return {
    signIn,
    signOut,
    signUp,
    getAuthUser,
    requestResetCode
  };
}
