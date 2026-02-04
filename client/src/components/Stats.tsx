const Stats = () => {
  const audienceCards = [
    {
      title: "Alumni",
      description: "Stay connected with your community, mentor the next generation, share your expertise, and discover collaboration opportunities.",
      color: "#4A7CFF"
    },
    {
      title: "Students",
      description: "Get guidance and support from experienced alumni, collaborate on projects, and build meaningful connections for your future career.",
      color: "#10b981"
    },
    {
      title: "Teachers",
      description: "Collaborate with alumni on research projects, invite industry experts to share insights, and strengthen academic-professional bridges.",
      color: "#f59e0b"
    }
  ];

  return (
    <section className="trust-section" id="who-this-is-for">
      <div className="trust-container">
        <div className="trust-header">
          <span className="trust-badge">Find Your Place</span>
          <h2 className="trust-main-title">Who This Is For</h2>
          <p className="trust-subtitle">Let us help you see yourself in our community</p>
        </div>
        
        <div className="trust-grid">
          {audienceCards.map((card, index) => (
            <div key={index} className="trust-card">
              <div className="trust-card-inner">
                <h3 className="trust-title">{card.title}</h3>
                <p className="trust-description">{card.description}</p>
                <div className="trust-accent" style={{ backgroundColor: card.color }}></div>
              </div>
              <div className="trust-card-bg" style={{ backgroundColor: `${card.color}05` }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
