import React from "react";
import { auth, db } from "./db";

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null
      };
    }

    componentDidMount() {
      this.listener = auth().onAuthStateChanged(async user => {
        if (user) {
          const userRef = db.doc(`users/${user.uid}`);
          const snapShot = await userRef.get();
          const { displayName, email, providerData } = user;
          const authUser = {
            displayName,
            email,
            id: user.uid
          }

          if (!snapShot.exists) {
            const createdAt = new Date();

            try {
              await userRef.set({
                ...authUser,
                providerData,
                createdAt,
                entries: []
              });
            } catch (err) {
              console.log(err);
            }
          }
          this.setState({ authUser });
        } else {
          this.setState({ authUser: null });
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <Component {...this.props} currentUser={this.state.authUser} />
      );
    }
  };

  return WithAuthentication;
};

export default withAuthentication;
