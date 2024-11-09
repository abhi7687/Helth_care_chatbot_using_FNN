import React from "react";
import './starsEffect.scss';

const Stars = () => {
    // Generate an array of 50 stars
    const stars = Array.from({ length: 50 });
  
    return (
      <div className="stars">
        {stars.map((_, index) => (
          <div key={index} className="star"></div>
        ))}
      </div>
    );
  };
  
  export default Stars;