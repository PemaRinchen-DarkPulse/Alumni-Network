import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './style.css';
import mentorshipImage from '../../images/mentorship.jpg';

export const BecomeMentor = () => {
  return (
    <>
      <MentoringHero />
      <MentorForm />
      <ApplicationProcess />
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
            <Input id="mentorName" name="mentorName" placeholder="e.g., John Doe" type="text" required />
          </FormGroup>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input id="email" name="email" placeholder="e.g., johndoe@example.com" type="text" required />
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
            <Input id="degree" name="degree" placeholder="e.g., B.Tech Computer Science" type="text" required />
          </FormGroup>

          <FormGroup>
            <Label>Areas of Expertise</Label>
            {expertiseOptions.map((option, index) => (
              <FormGroup check key={index}>
                <Input type="checkbox" id={`expertise${index}`} name="expertise" value={option} />
                <Label check htmlFor={`expertise${index}`}>
                  {option}
                </Label>
              </FormGroup>
            ))}
            <FormGroup check>
              <Input type="checkbox" id="expertiseOthers" onChange={handleOthersChange} />
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
            <Input type="checkbox" required />
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

export const MentorDashboard = () => {
  return (
    <>
      <div className='row' style={{ marginTop: "95px" }}>
        <div className="col-2 bg-dark text-white" style={{ position: "fixed", height: "90vh" }}>
          <ul>
            <li>Dashboard Overview</li>
            <li>My Mentees</li>
            <li>Mentorship Requests</li>
            <li>Messages</li>
            <li>Mentorship Sessions</li>
            <li>Resources</li>
            <li>Feedback & Reviews</li>
          </ul>
        </div>
        <div className="col-9 mb-5" style={{ marginLeft: "250px" }}>
          <Dashboard />
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  return (
    <>
      <div>
        <h3>Overview</h3>
        <div className="row">
          <div className="col rounded-3 me-3" style={{ height: "150px", backgroundColor: "#CACACA" }}>asdasd</div>
          <div className="col rounded-3 me-3" style={{ height: "150px", backgroundColor: "#CACACA" }}>asdasd</div>
          <div className="col rounded-3 me-3" style={{ height: "150px", backgroundColor: "#CACACA" }}>asdasd</div>
          <div className="col rounded-3" style={{ height: "150px", backgroundColor: "#CACACA" }}>asdasd</div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-8 rounded-3 me-3 p-4" style={{ backgroundColor: "#f8f9fa", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <h3>Mentor Request</h3>
            <table className="table table-striped rounded-2">
              <thead>
                <tr className="table-dark">
                  <th scope="col">Sl.No</th>
                  <th scope="col">Mentee Name</th>
                  <th scope="col">Subject Of Interest</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action Taken</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Mark</td>
                  <td>Engineering Maths</td>
                  <td>Pending</td>
                  <td>accept/Reject</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Jacob</td>
                  <td>TOC</td>
                  <td>Accepted</td>
                  <td>Discard</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>John</td>
                  <td>CN</td>
                  <td>Accepted</td>
                  <td>Discard</td>
                </tr>
                <tr>
                  <th scope="row">4</th>
                  <td>Eriksen</td>
                  <td>DAA</td>
                  <td>Pending</td>
                  <td>Accept/Rejcet</td>
                </tr>
                <tr>
                  <th scope="row">5</th>
                  <td>Emily</td>
                  <td>ESMt</td>
                  <td>Pending</td>
                  <td>Accept/Reject</td>
                </tr>
              </tbody>
            </table>
            <button>Previous</button>
            <button>Next</button>


          </div>
          <div className="col rounded-3 p-4" style={{ height: "150px", backgroundColor: "#f8f9fa", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <h5 className="text-center" style={{ color: "#666" }}>Additional Info</h5>
            <p className="text-center">This section can contain more details about the mentor request process or related links.</p>
          </div>
        </div>
      </div>

        <div className="row mt-5 p-3">
        <div className="col-8 rounded-3 me-3 p-4" style={{ backgroundColor: "#f8f9fa", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <h3>To Do List</h3>
            <input className='me-3 p-1 rounded-2' type="text" name="" id="" placeholder='Add new Task' />
            <input className='me-3 p-1 rounded-2' type="date"/>
            <button className='rounded-2'>Add Task</button>
            <table className="table table-striped rounded-2">
              <thead>
                <tr className="table-dark">
                  <th scope="col"></th>
                  <th scope="col">Task Name</th>
                  <th scope="col">Deadline</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row"><input type="radio" /></th>
                  <td>Mark</td>
                  <td>Engineering Maths</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
            <button>Previous</button>
            <button>Next</button>
          </div>
          <div className="col rounded-3" style={{ height: "150px", backgroundColor: "#CACACA" }}>asdasd</div>
        </div>

    </>
  )
}