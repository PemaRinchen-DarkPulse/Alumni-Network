import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';

export const MissionStatement = () => {
    return (
        <Card className="mb-4">
            <CardBody>
                <CardTitle tag="h5">Mission Statement</CardTitle>
                <CardText>
                    Our mission is to foster a vibrant alumni community that supports lifelong connections and professional growth.
                </CardText>
            </CardBody>
        </Card>
    );
};



export const VisionStatement = () => {
    return (
        <Card className="mb-4">
            <CardBody>
                <CardTitle tag="h5">Vision Statement</CardTitle>
                <CardText>
                    We envision a united network of alumni dedicated to enhancing the impact of our institution through collaboration and mentorship.
                </CardText>
            </CardBody>
        </Card>
    );
};


export const Purpose = () => {
    return (
        <Card className="mb-4">
            <CardBody>
                <CardTitle tag="h5">Purpose of the Alumni Network</CardTitle>
                <CardText>
                    The purpose of our alumni network is to provide a platform for alumni to connect, share resources, and contribute to the community.
                </CardText>
            </CardBody>
        </Card>
    );
};


export const Benefits = () => {
    return (
        <Card className="mb-4">
            <CardBody>
                <CardTitle tag="h5">Benefits of Joining</CardTitle>
                <CardText>
                    As a member, you will have access to exclusive networking events, mentorship opportunities, and career resources.
                </CardText>
            </CardBody>
        </Card>
    );
};

export const TargetAudience = () => {
    return (
        <Card className="mb-4">
            <CardBody>
                <CardTitle tag="h5">Target Audience</CardTitle>
                <CardText>
                    Our network is open to all alumni, faculty, and current students who want to engage with our community.
                </CardText>
            </CardBody>
        </Card>
    );
};

export const GetInvolved = () => {
    return (
        <Card className="mb-4">
            <CardBody>
                <CardTitle tag="h5">How to Get Involved</CardTitle>
                <CardText>
                    To get involved, sign up on our website, attend our events, and connect with fellow alumni on our platform.
                </CardText>
            </CardBody>
        </Card>
    );
};

export const FAQs = () => {
    return (
        <Card className="mb-4">
            <CardBody>
                <CardTitle tag="h5">FAQs</CardTitle>
                <Accordion>
                    <AccordionItem>
                        <AccordionHeader targetId="1">What events do you organize?</AccordionHeader>
                        <AccordionBody accordionId="1">
                            We organize networking events, workshops, and guest speaker sessions throughout the year.
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionHeader targetId="2">How can I update my contact information?</AccordionHeader>
                        <AccordionBody accordionId="2">
                            You can update your contact information through your profile on our alumni network website.
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionHeader targetId="3">Is there a membership fee?</AccordionHeader>
                        <AccordionBody accordionId="3">
                            Membership is free for all alumni and faculty members.
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </CardBody>
        </Card>
    );
};