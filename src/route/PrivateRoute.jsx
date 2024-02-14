import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../layout/index';


function PrivateRoute({ isSignedIn, children }) {
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
    <Layout>
      {children}
    </Layout>
    </>
  );
 
}

export default PrivateRoute;