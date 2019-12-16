import React from "react";
import Head from "next/head";
import withAuthentication from "../lib/withAuthentication";
import LoginForm from "../components/loginForm";
import App from "../components/app";

const Index = ({ currentUser }) => {
  console.log(currentUser);

  return (
    <>
      <Head>
        <title>🍝</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {currentUser ? <App user={currentUser} /> : <LoginForm />}
    </>
  );
};

export default withAuthentication(Index);
