import { auth } from "./db";

export default {
  googleLogin() {
    const googleProvider = new auth.GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    auth()
      .signInWithPopup(googleProvider)
      .then(function(result) {
        const user = result.user;
        console.log(user);
        return result;
      })
      .catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error: [${errorCode}] ${errorMessage}`);
      });
  }
};
