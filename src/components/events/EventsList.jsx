import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import './style.css'
const events = [
    {
        id: 1,
        title: "Tech Conference 2024",
        date: "October 20, 2024",
        time: "10:00 AM - 4:00 PM",
        location: "New York, NY",
        description: "Join us for a day of insightful talks, workshops, and networking with industry leaders. This conference will cover topics like artificial intelligence, cloud computing, and cybersecurity. There will be opportunities for networking with industry professionals and hands-on workshops to boost your skills.",
        imageUrl: "https://source.unsplash.com/1600x900/?technology,conference"
    },
    {
        id: 2,
        title: "Startup Pitch Night",
        date: "November 5, 2024",
        time: "6:00 PM - 9:00 PM",
        location: "San Francisco, CA",
        description: "Watch innovative startups pitch their ideas to a panel of investors and industry experts. This is a fantastic opportunity for founders to gain feedback, secure funding, and make valuable connections within the startup ecosystem.",
        imageUrl: "https://source.unsplash.com/1600x900/?startup,business"
    },
    {
        id: 3,
        title: "Community Hackathon",
        date: "December 1, 2024",
        time: "8:00 AM - 6:00 PM",
        location: "Austin, TX",
        description: "Collaborate with fellow developers and creatives to solve pressing problems in the community. This hackathon will focus on creating solutions for social impact, ranging from education to healthcare. Prizes will be awarded to the best projects.",
        imageUrl: "https://source.unsplash.com/1600x900/?hackathon,community"
    },
    {
        id: 4,
        title: "AI Summit 2024",
        date: "January 15, 2024",
        time: "9:00 AM - 5:00 PM",
        location: "Boston, MA",
        description: "Explore the future of AI and machine learning with experts and innovators from around the globe.",
        imageUrl: "https://source.unsplash.com/1600x900/?ai,robotics"
    },
    {
        id: 5,
        title: "Blockchain Expo 2024",
        date: "February 10, 2024",
        time: "10:00 AM - 6:00 PM",
        location: "San Francisco, CA",
        description: "Dive deep into the world of blockchain technology and cryptocurrency with industry leaders and innovators. This expo will showcase cutting-edge blockchain applications and discuss the future of decentralized finance.",
        imageUrl: "https://source.unsplash.com/1600x900/?blockchain,expo"
    },
    {
        id: 6,
        title: "Green Energy Summit",
        date: "March 5, 2024",
        time: "9:00 AM - 4:00 PM",
        location: "Denver, CO",
        description: "Join experts in renewable energy as they discuss the latest developments in solar, wind, and sustainable energy solutions. This summit will feature workshops, panel discussions, and networking opportunities.",
        imageUrl: "https://source.unsplash.com/1600x900/?energy,solar"
    },
    {
        id: 7,
        title: "Healthcare Innovation Forum",
        date: "April 20, 2024",
        time: "8:00 AM - 5:00 PM",
        location: "Chicago, IL",
        description: "Discover the latest advancements in healthcare technology, from telemedicine to AI-driven diagnostics. This forum brings together healthcare professionals, technologists, and entrepreneurs to shape the future of healthcare.",
        imageUrl: "https://source.unsplash.com/1600x900/?healthcare,innovation"
    },
    {
        id: 8,
        title: "E-commerce Growth Conference",
        date: "May 12, 2024",
        time: "11:00 AM - 6:00 PM",
        location: "Los Angeles, CA",
        description: "Learn strategies for scaling e-commerce businesses from industry experts. This conference will cover topics such as digital marketing, supply chain management, and customer retention for e-commerce platforms.",
        imageUrl: "https://source.unsplash.com/1600x900/?ecommerce,conference"
    },
    {
        id: 9,
        title: "Virtual Reality Expo",
        date: "June 18, 2024",
        time: "10:00 AM - 5:00 PM",
        location: "Seattle, WA",
        description: "Experience the future of virtual reality with hands-on demos, workshops, and expert panels. This expo will explore the applications of VR in gaming, education, and beyond.",
        imageUrl: "https://source.unsplash.com/1600x900/?virtualreality,expo"
    },
    {
        id: 10,
        title: "Cybersecurity Summit 2024",
        date: "July 15, 2024",
        time: "9:00 AM - 5:00 PM",
        location: "Washington, D.C.",
        description: "Join cybersecurity professionals and leaders for a day of workshops, discussions, and networking. Topics will include the latest in threat prevention, data protection, and ethical hacking.",
        imageUrl: "https://source.unsplash.com/1600x900/?cybersecurity,summit"
    },
    {
        id: 11,
        title: "EdTech Innovation Conference",
        date: "August 7, 2024",
        time: "8:30 AM - 4:30 PM",
        location: "Boston, MA",
        description: "Explore the latest in education technology, including AI-driven learning platforms, digital classrooms, and more. This event brings together educators, technologists, and policy makers to discuss the future of education.",
        imageUrl: "https://source.unsplash.com/1600x900/?education,technology"
    },
    {
        id: 12,
        title: "Global Marketing Expo",
        date: "September 12, 2024",
        time: "10:00 AM - 6:00 PM",
        location: "Las Vegas, NV",
        description: "Learn from marketing experts and innovators about the latest trends in digital marketing, social media strategies, and brand management at this global expo.",
        imageUrl: "https://source.unsplash.com/1600x900/?marketing,expo"
    },
    {
        id: 13,
        title: "Smart Cities Conference 2024",
        date: "October 3, 2024",
        time: "9:00 AM - 4:00 PM",
        location: "Miami, FL",
        description: "This conference will focus on the future of urban development with smart technologies, including IoT, AI, and sustainable urban infrastructure solutions.",
        imageUrl: "https://source.unsplash.com/1600x900/?smartcity,urban"
    },
    {
        id: 14,
        title: "Cloud Computing Symposium",
        date: "November 20, 2024",
        time: "8:00 AM - 3:00 PM",
        location: "Austin, TX",
        description: "Discover the latest advancements in cloud computing, from infrastructure to security. Hear from industry leaders on best practices, cloud optimization, and emerging technologies.",
        imageUrl: "https://source.unsplash.com/1600x900/?cloudcomputing,technology"
    }


];

export const EventsList = () => {
    const [visibleEvents, setVisibleEvents] = useState(getEventsPerPage()); // Initial visible events
    const navigate = useNavigate();

    // Adjust number of visible events based on window size
    useEffect(() => {
        const handleResize = () => setVisibleEvents(getEventsPerPage());
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function getEventsPerPage() {
        const width = window.innerWidth;
        if (width < 768) {
            return 3; // Mobile - 1 event per page
        } else if (width >= 768 && width < 992) {
            return 4; // Tablet - 2 events per page
        } else {
            return 6; // Desktop - 3 events per page
        }
    }

    const loadMore = () => {
        setVisibleEvents(prevVisible => Math.min(prevVisible + 6, events.length)); // Load 6 more events
    };

    const loadLess = () => {
        setVisibleEvents(prevVisible => Math.max(prevVisible - 6, 6)); // Show 6 less events (minimum is 6)
    };

    const handleReadMore = (id) => {
        navigate(`/events/${id}`);
    };


    return (
        <Container className="my-5">
            <div style={{marginTop: "120px"}}>
                <EventCreationSection /><br/>
                <FilterComponent/>
            </div>

            <Row className="mt-5">
                {events.slice(0, visibleEvents).map(event => (
                    <Col className="col-12 col-md-6 col-lg-4 d-flex justify-content-center align-items-center" key={event.id}>
                        <div className='w-300'>
                            <EventCard
                                title={event.title}
                                date={event.date}
                                time={event.time}
                                location={event.location}
                                description={event.description}
                                imageUrl={event.imageUrl}
                                onReadMore={() => handleReadMore(event.id)}
                            />
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Load more/less buttons */}
            <div className="text-center mt-4">
                {visibleEvents < events.length && (
                    <Button color="primary" className="mr-2" onClick={loadMore}>
                        Load More
                    </Button>
                )}

                {visibleEvents > 6 && (
                    <Button color="secondary" onClick={loadLess} style={{ marginLeft: '10px' }}>
                        Load Less
                    </Button>
                )}
            </div>
        </Container>
    );
};

export const EventCreationSection = () => {
    const navigate = useNavigate();

    const handleCreateEventClick = () => {
        navigate('/create-event'); // Adjust the path to your create event page
    };
    const styles = {
        containerLarge: {
            display: 'flex',
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
        },
        imageContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center', // Center the image within the container
            alignItems: 'center',
            marginRight: '20px',
        },
        image: {
            width: '300px',
            height: '300px',
            borderRadius: '8px',
        },
        textContainer: {
            flex: 1,
        },
        button: {
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        containerSmall: {
            textAlign: 'center', // Center text and image for small screens
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
        },
        imageSmall: {
            width: '200px',
            height: '200px',
            borderRadius: '8px',
            display: 'block', // Ensures proper block-level behavior
            margin: '0 auto', // Center the image horizontally
        },
    };
    return (
        <>
            <div className='d-none d-md-flex' style={styles.containerLarge}>
                <div style={styles.imageContainer}>
                    <img
                        src="https://via.placeholder.com/60" // Replace with your desired image URL
                        alt="Event"
                        style={styles.image}
                    />
                </div>
                <div style={styles.textContainer}>
                    <h2>Make Your Own Event</h2>
                    <p>
                        Create unforgettable experiences by organizing your own events. Whether it's a
                        party, workshop, or gathering, the possibilities are endless. Start planning
                        today!
                    </p>
                    <button onClick={handleCreateEventClick} style={styles.button}>
                        Create Event
                    </button>
                </div>
            </div>

            <div className='d-block d-md-none' style={styles.containerSmall}>
                <div className="text-center"> {/* Center text and image for small screens */}
                    <h2 className='text-center'>Make Your Own Event</h2>
                    <img className='rounded-3 ms-auto'
                        src="https://via.placeholder.com/60" // Replace with your desired image URL
                        alt="Event"
                        style={styles.imageSmall} // Image style for small screens
                    />
                    <p>
                        Create unforgettable experiences by organizing your own events. Whether it's a
                        party, workshop, or gathering, the possibilities are endless. Start planning
                        today!
                    </p>
                    <button onClick={handleCreateEventClick} style={styles.button}>
                        Create Event
                    </button>
                </div>
            </div>
        </>
    );
    
};


export const FilterComponent = ({ events, setFilteredEvents }) => {
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const days = ['Today', 'Tomorrow', 'This Week', 'Next Week'];
    const eventTypes = ['Meeting', 'Workshop', 'Webinar', 'Social'];
    const times = ['Morning', 'Afternoon', 'Evening'];

    const style = {
        card: {
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px',
        },
        button: {
            marginLeft: '10px',
        },
    };

    return (
        <div style={style.card} className="card filter-container">
            <div className="d-flex flex-column flex-md-row align-items-center mb-3">
                <h1 className="col-12 col-md-5 text-start ms-md-3">Upcoming Events</h1>
                <div className="d-flex flex-column flex-md-row gap-3 justify-content-between w-100">
                    <select className="form-select mb-2 mb-md-0" style={{ width: '100%' }} value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                        <option value="">Select Day</option>
                        {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>

                    <select className="form-select mb-2 mb-md-0" style={{ width: '100%' }} value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                        <option value="">Select Event Type</option>
                        {eventTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select className="form-select mb-2 mb-md-0" style={{ width: '100%' }} value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                        <option value="">Select Time</option>
                        {times.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" style={style.button}>
                        Filter
                    </button>
                </div>
            </div>
        </div>
    );
};
