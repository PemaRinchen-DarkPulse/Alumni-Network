import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import {Button,Form,FormGroup,Label,Input} from 'reactstrap';
import './style.css'; 
import mentorshipImage from '../../images/mentorship.jpg';

export const BecomeMentor=()=>{
    return(
       <>
       <MentoringHero/>
       <MentorForm/>
       <ApplicationProcess/>
       </> 
    );
}

export const MentorForm = () => {
  const expertiseOptions = [
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Mobile Development",
    "Cybersecurity",
    "Cloud Computing"
  ];

  const [otherExpertise, setOtherExpertise] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleOthersChange = (event) => {
    setShowOtherInput(event.target.checked);
    if (!event.target.checked) {
      setOtherExpertise(''); // Reset the input if "Others" is unchecked
    }
  };

  return (
    <>
      <div className="form-container">
        <h1 className="form-title">Become a Mentor</h1>
        <Form>
          <FormGroup>
            <Label for="mentorName">Full Name</Label>
            <Input id="mentorName" name="mentorName" placeholder="e.g., John Doe" type="text" required/>
          </FormGroup>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input id="email" name="email" placeholder="e.g., johndoe@example.com" type="text" required/>
          </FormGroup>

          <FormGroup>
            <Label for="graduationYear">Graduation Year</Label>
            <Input id="graduationYear" name="graduationYear" type="select" required>
              <option disabled selected>Select Graduation Year</option>
              <option>2022</option>
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="degree">Degree/Major</Label>
            <Input id="degree" name="degree" placeholder="e.g., B.Tech Computer Science" type="text" required/>
          </FormGroup>
          
          <FormGroup>
            <Label>Areas of Expertise</Label>
            {expertiseOptions.map((option, index) => (
              <FormGroup check key={index}>
                <Input type="checkbox" id={`expertise${index}`} name="expertise" value={option}/>
                <Label check htmlFor={`expertise${index}`}>
                  {option}
                </Label>
              </FormGroup>
            ))}
            <FormGroup check>
              <Input type="checkbox" id="expertiseOthers" onChange={handleOthersChange}/>
              <Label check htmlFor="expertiseOthers">
                Others
              </Label>
            </FormGroup>
            {showOtherInput && (
              <FormGroup>
                <Label for="otherExpertise">Specify Other Area of Expertise</Label>
                <Input id="otherExpertise" name="otherExpertise" placeholder="e.g., AI Research" type="text" value={otherExpertise} onChange={(e) => setOtherExpertise(e.target.value)} />
              </FormGroup>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="exampleText">Why Do You Want to Be a Mentor?</Label>
            <Input id="exampleText" name="text" type="textarea" placeholder="Share your motivations and what you hope to achieve as a mentor..." required style={{ minHeight: "100px" }} />
          </FormGroup>

          <FormGroup check>
            <Input type="checkbox" required/>
            <Label check>I agree to the terms and conditions</Label>
          </FormGroup>

          <Button color="primary" style={{ width: "100%", marginTop: "20px" }}>Sign Up</Button>
        </Form>
      </div>
    </>
  );
};

export const MentoringHero = () => {
    return (
        <section className="container-fluid mb-5" id="home" 
            style={{
                backgroundImage: `url(${mentorshipImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "90vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
            }}>
            <div className="p-4 rounded-4 pema">
                <h1>Become a Real Hero</h1>
                <h5>As a mentor, you can make a real difference in someone's life. Share your knowledge, inspire others, and help shape the future. Your guidance can unlock potential and foster growth. Join us and be a hero to the next generation!
                </h5>
            </div>
        </section>
    );
}

export const ApplicationProcess = () => {
    return (
      <Container className='my-5'>
        <Row className='justify-content-center'>
          <Col md={8}>
            <Card className='text-center'>
              <CardBody>
                <CardTitle tag='h1'>Application Review Process</CardTitle>
                <CardText style={{ fontSize: '16px' }}>
                  Once you submit your application, it will be carefully reviewed by our admin team. We will assess your qualifications and expertise to ensure the best fit for our mentees. You will be notified of your application status via email.
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };