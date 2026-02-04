import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Sign Up",
      description: "Sign up with your alumni credentials to join the network.",
      step: "01"
    },
    {
      id: 2,
      title: "Complete Your Profile",
      description: "Add your cohort, current role, expertise, and interests to help others find you.",
      step: "02"
    },
    {
      id: 3,
      title: "Connect, Mentor & Collaborate",
      description: "Start connecting with fellow alumni, share knowledge, and collaborate on opportunities.",
      step: "03"
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="hiw-container">
        <div className="hiw-header">
          <h2 className="hiw-title">How It Works</h2>
          <p className="hiw-subtitle">Get started in 3 simple steps</p>
        </div>
        
        <div className="hiw-steps">
          {steps.map((step, index) => (
            <div className="hiw-step" key={step.id}>
              <div className="hiw-number-wrapper">
                <span className="hiw-number">{step.step}</span>
                {index < steps.length - 1 && <div className="hiw-connector"></div>}
              </div>
              <h3 className="hiw-step-title">{step.title}</h3>
              <p className="hiw-step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
