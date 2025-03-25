import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The alumni network helped me find my first job out of college. The mentorship program connected me with an industry veteran who guided me through the interview process.",
      name: "Sarah Johnson",
      title: "Software Engineer",
      class: "Class of 2018",
      image: "/testimonial-1.jpg"
    },
    {
      quote: "I relocated to a new city and used the alumni directory to connect with fellow graduates in the area. It made the transition so much easier having an instant community.",
      name: "Michael Chen",
      title: "Marketing Director",
      class: "Class of 2015",
      image: "/testimonial-2.jpg"
    },
    {
      quote: "The discussion forums have been invaluable for staying current in my field. The insights and advice from experienced alumni have helped me navigate career transitions.",
      name: "Elena Rodriguez",
      title: "Healthcare Administrator",
      class: "Class of 2012",
      image: "/testimonial-3.jpg"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(1); // Start with middle testimonial

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-5 bg-secondary bg-opacity-10">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 mb-2">Success Stories</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '800px', fontSize: '1.1rem' }}>
            Hear from alumni who have benefited from our network.
          </p>
        </div>

        <div className="testimonials-container position-relative">
          <div className="testimonials-track d-flex align-items-center justify-content-center">
            {testimonials.map((testimonial, index) => {
              const position = (index - activeIndex + testimonials.length) % testimonials.length;
              const isActive = position === 0;
              const isPrev = position === testimonials.length - 1;
              const isNext = position === 1;

              return (
                <div
                  key={index}
                  className={`testimonial-card ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}`}
                >
                  <div className="testimonial-content text-center p-4">
                    <div className="quote-icon mb-3">
                      <FaQuoteLeft className="text-primary" size={24} />
                    </div>
                    <p className="testimonial-quote mb-4">{testimonial.quote}</p>
                    <div className="testimonial-author">
                      <div className="author-image mb-2">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="rounded-circle"
                          width="60"
                          height="60"
                        />
                      </div>
                      <h5 className="author-name mb-1">{testimonial.name}</h5>
                      <p className="author-title mb-1 text-primary">{testimonial.title}</p>
                      <p className="author-class text-muted small">{testimonial.class}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="slider-button prev-button"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft />
          </button>
          <button
            className="slider-button next-button"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <FaChevronRight />
          </button>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials; 