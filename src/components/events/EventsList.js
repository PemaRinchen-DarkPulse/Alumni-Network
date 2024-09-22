import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';

const events = [
    {
        id: 1,
        title: "Tech Conference 2024",
        date: "October 20, 2024",
        time: "10:00 AM - 4:00 PM",
        location: "New York, NY",
        description: "Join us for a day of insightful talks, workshops, and networking with industry leaders. This conference will cover topics like artificial intelligence, cloud computing, and cybersecurity. There will be opportunities for networking with industry professionals and hands-on workshops to boost your skills.",
        imageUrl: "https://source.unsplash.com/1600x900/?technology,conference" // Placeholder image
    },
    {
        id: 2,
        title: "Startup Pitch Night",
        date: "November 5, 2024",
        time: "6:00 PM - 9:00 PM",
        location: "San Francisco, CA",
        description: "Watch innovative startups pitch their ideas to a panel of investors and industry experts. This is a fantastic opportunity for founders to gain feedback, secure funding, and make valuable connections within the startup ecosystem.",
        imageUrl: "https://source.unsplash.com/1600x900/?startup,business" // Placeholder image
    },
    {
        id: 3,
        title: "Community Hackathon",
        date: "December 1, 2024",
        time: "8:00 AM - 6:00 PM",
        location: "Austin, TX",
        description: "Collaborate with fellow developers and creatives to solve pressing problems in the community. This hackathon will focus on creating solutions for social impact, ranging from education to healthcare. Prizes will be awarded to the best projects.",
        imageUrl: "https://source.unsplash.com/1600x900/?hackathon,community" // Placeholder image
    },
    {
        id: 3,
        title: "Community Hackathon",
        date: "December 1, 2024",
        time: "8:00 AM - 6:00 PM",
        location: "Austin, TX",
        description: "Collaborate with fellow developers and creatives to solve pressing problems in the community. This hackathon will focus on creating solutions for social impact, ranging from education to healthcare. Prizes will be awarded to the best projects.",
        imageUrl: "https://source.unsplash.com/1600x900/?hackathon,community" // Placeholder image
    },
    {
        id: 3,
        title: "Community Hackathon",
        date: "December 1, 2024",
        time: "8:00 AM - 6:00 PM",
        location: "Austin, TX",
        description: "Collaborate with fellow developers and creatives to solve pressing problems in the community. This hackathon will focus on creating solutions for social impact, ranging from education to healthcare. Prizes will be awarded to the best projects.",
        imageUrl: "https://source.unsplash.com/1600x900/?hackathon,community" // Placeholder image
    },
    {
        id: 3,
        title: "Community Hackathon",
        date: "December 1, 2024",
        time: "8:00 AM - 6:00 PM",
        location: "Austin, TX",
        description: "Collaborate with fellow developers and creatives to solve pressing problems in the community. This hackathon will focus on creating solutions for social impact, ranging from education to healthcare. Prizes will be awarded to the best projects.",
        imageUrl: "https://source.unsplash.com/1600x900/?hackathon,community" // Placeholder image
    },
    {
        id: 4,
        title: "AI Summit 2024",
        date: "January 15, 2024",
        time: "9:00 AM - 5:00 PM",
        location: "Boston, MA",
        description: "Explore the future of AI and machine learning with experts and innovators from around the globe.",
        imageUrl: "https://source.unsplash.com/1600x900/?ai,robotics" // Placeholder image
    }
    // Add more events
];

export const EventsList = () => {
    const [visibleEvents, setVisibleEvents] = useState(6); // Show 6 events initially (2 rows)
    const navigate = useNavigate();

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
            <div style={{ marginTop: "120px" }}>
                <EventCreationSection />
            </div>
            <Row className='mt-5'>
                <FilterComponent />
                {events.slice(0, visibleEvents).map(event => (
                    <Col className='mb-5' md="4" key={event.id}>
                        <div style={{ height: '100%' }}>
                            <EventCard
                                title={event.title}
                                date={event.date}
                                time={event.time}
                                location={event.location}
                                description={event.description}
                                imageUrl={event.imageUrl} // Pass image URL
                                onReadMore={() => handleReadMore(event.id)}
                            />
                        </div>
                    </Col>
                ))}
            </Row>

            <div className="text-center mt-4">
                {visibleEvents < events.length && (
                    <Button color="primary" className="mr-2" onClick={loadMore}>
                        Load More
                    </Button>
                )}

                {visibleEvents > 6 && (
                    <Button color="secondary" onClick={loadLess}>
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

    return (
        <div style={styles.container}>
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
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
    },
    imageContainer: {
        flex: 1,
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
};

export const FilterComponent = ({ events, setFilteredEvents }) => {
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const days = ['Today', 'Tomorrow', 'This Week', 'Next Week'];
    const eventTypes = ['Meeting', 'Workshop', 'Webinar', 'Social'];
    const times = ['Morning', 'Afternoon', 'Evening'];

    const handleFilter = () => {
        const filtered = events.filter(event => {
            const matchesDay = selectedDay ? event.day === selectedDay : true;
            const matchesType = selectedType ? event.type === selectedType : true;
            const matchesTime = selectedTime ? event.time === selectedTime : true;

            return matchesDay && matchesType && matchesTime;
        });

        setFilteredEvents(filtered);
    };

    const styles = {
        filterContainer: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            margin: '20px 0',
        },
        filterTitle: {
            fontSize: '1.5rem',
            marginBottom: '15px',
            color: '#333',
        },
        filterDropdowns: {
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '15px',
        },
        filterSelect: {
            padding: '10px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none',
            transition: 'border 0.3s',
        },
        filterButton: {
            padding: '10px 15px',
            fontSize: '1rem',
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
    };

    return (
        <div style={styles.filterContainer}>
            <div style={styles.filterDropdowns}>
                <h1 className='text-start'>Upcoming Events</h1>
                <select
                    style={styles.filterSelect}
                    value={selectedDay}
                    onChange={e => setSelectedDay(e.target.value)}
                >
                    <option value="">Select Day</option>
                    {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>

                <select
                    style={styles.filterSelect}
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                >
                    <option value="">Select Event Type</option>
                    {eventTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <select
                    style={styles.filterSelect}
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                >
                    <option value="">Select Time</option>
                    {times.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
                <button style={styles.filterButton} onClick={handleFilter}>
                    Filter
                </button>
            </div>
        </div>
    );
};
