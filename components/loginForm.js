import React from "react";
import auth from "../lib/auth";

const LoginForm = () => {
  return (
    <div className="bg-gray-200 min-h-screen h-full">
      <div className="container mx-auto w-full min-h-screen justify-around max-w-lg flex flex-col">
        <div>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <div className="text-center mb-8">✂️🍝</div>
            <button
              className="mb-4 w-full text-white bg-teal-600 hover:bg-teal-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => auth.googleLogin()}
            >
              Login with Google
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            &copy;2019 erinleelikes.com. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
