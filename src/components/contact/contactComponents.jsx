import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './Contact.css';  // Assuming you have an external CSS file for styling

const Contact = () => {
    return (
        <>
            <Container className="contact-page">
                <Row>
                    <Col md="6" className='group'>
                        <Card className="mb-4 contact-card">
                            <CardBody>
                                <CardTitle tag="h5">Get in Touch</CardTitle>
                                <CardText>
                                    Feel free to reach out to us using the following contact information or the form below.
                                </CardText>
                                <ul className="contact-info">
                                    <li><strong>Phone:</strong> +97508270413 / +97508270414</li>
                                    <li><strong>Email:</strong> theroyalacademy@academy.bt</li>
                                    <li><strong>Address:</strong> 123 Alumni Street, City, Country</li>
                                    <li><strong>Office Hours:</strong> Mon - Fri, 9 AM - 5 PM</li>
                                </ul>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6" className='group'>
                        <Card className="mb-4 contact-card">
                            <CardBody>
                                <CardTitle tag="h5">Contact Form</CardTitle>
                                <Form>
                                    <FormGroup>
                                        <Label for="name">Name</Label>
                                        <Input type="text" name="name" id="name" placeholder="Enter your name" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input type="email" name="email" id="email" placeholder="Enter your email" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="message">Message</Label>
                                        <Input type="textarea" name="message" id="message" placeholder="Enter your message" />
                                    </FormGroup>
                                    <Button color="primary" className="submit-btn">Submit</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Full-screen Map */}
            <div className="map-fullscreen mb-5">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.989275221594!2d89.433769!3d27.3298568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e18300666868a7%3A0x1bd738cb644205f1!2sDungkar%20Dzong!5e0!3m2!1sen!2sbt!4v1692618762927!5m2!1sen!2sbt" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </>
    );
};

export default Contact;
