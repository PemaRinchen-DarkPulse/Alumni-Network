import React from 'react';

function MyComponent() {
  const backgroundImageStyle = {
    backgroundImage: "url('..')",
    backgroundSize: 'cover', // Or 'contain', depending on your needs
    backgroundRepeat: 'no-repeat', // Avoids repeating the image
    backgroundPosition: 'center', // Centers the image
    height: '100vh', // Full height of the viewport, adjust as needed
  };

  return (
    <div style={backgroundImageStyle}>
      {/* Your component content here */}
      <h1>Hello, World!</h1>
    </div>
  );
}

export default MyComponent;
