import React from 'react';
import { Spinner } from 'react-bootstrap';

export function SpinLoader() {
  return (
    <div className="overlay">
      <Spinner
        animation="border"
        variant="primary"
        size="lg"
        className="overlay-content"
      />
    </div>
  );
}
