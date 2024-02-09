import React from 'react';
import './ErrorPage.scss';

function ErrorPage() {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>Oops!</h1>
          <h2>404 - The Page can&apos;t be found</h2>
        </div>
        <a href="/">Go TO Homepage</a>
      </div>
    </div>
  );
}

export default ErrorPage;
