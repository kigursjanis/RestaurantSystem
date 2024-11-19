import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Restorānu Sistēma</h5>
            <p>Jūsu ērtai restorānu apmeklējumu plānošanai</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p>© {new Date().getFullYear()} Visas tiesības aizsargātas</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;