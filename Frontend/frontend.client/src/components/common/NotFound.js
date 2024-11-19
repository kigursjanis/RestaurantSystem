import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-5">
      <h1 className="display-1">404</h1>
      <h2>Lapa nav atrasta</h2>
      <p>Diemžēl meklētā lapa nav atrasta.</p>
      <Link to="/" className="btn btn-primary">
        Atgriezties sākumlapā
      </Link>
    </div>
  );
};

export default NotFound; 