import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FaUpload, FaEdit, FaTrash, FaFolderPlus } from 'react-icons/fa';
import './style.css';
import mentorshipImage from '../../images/mentorship.jpg';
import Footer from '../navbarFooter/footer'
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
  // State to track which section is selected
  const [selectedSection, setSelectedSection] = useState('Overview');

  return (
    <>
      <div className='row' style={{ marginTop: "95px" }}>
        {/* Sidebar */}
        <div className="col-2 bg-dark text-white" style={{ position: "fixed", height: "90vh" }}>
          <ul>
            <li onClick={() => setSelectedSection('Overview')}>Overview</li>
            <li onClick={() => setSelectedSection('Schedule')}>Schedule</li>
            <li onClick={() => setSelectedSection('Messages')}>Messages</li>
            <li onClick={() => setSelectedSection('Resources')}>Resources</li>
            <li onClick={() => setSelectedSection('Feedback')}>Feedback</li>
            <li onClick={() => setSelectedSection('Learning')}>Learning & Development</li>
            <li onClick={() => setSelectedSection('Reviews')}>Live Sessions</li>
          </ul>
        </div>

        {/* Main content area */}
        <div className="col-9 mb-5" style={{ marginLeft: "250px", minHeight: "90vh" }}>
          {/* Conditionally render the component based on selected section */}
          {selectedSection === 'Overview' && <Dashboard />}
          {selectedSection === 'Schedule' && <MentorSchedule />}
          {selectedSection === 'Messages' && <MentorMessage />}
          {selectedSection === 'Resources' && <MentorResource />}
          {selectedSection === 'Feedback' && <MentorFeedback />}
          {selectedSection === 'Learning' && <MentorLearning />}
          {selectedSection === 'Reviews' && <MentorReviews />}
        </div>

        <Footer />
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
          <input className='me-3 p-1 rounded-2' type="date" />
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

// Other components
const MentorSchedule = () => {
  return (
    <>
      <p>Calendar view of upcoming meetings with mentees</p>
      <p>Option to book, cancel, or reschedule sessions</p>
    </>
  );
}

const MentorMessage = () => {
  return (
    <p>Messaging system for direct communication with mentees. Email or chat integration.</p>
  );
}

const MentorResource = () => {
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [student, setStudent] = useState('');
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isNewFolder, setIsNewFolder] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const folderName = isNewFolder ? newFolderName : selectedFolder;

    if (!folderName) {
      alert('Please select or enter a folder name.');
      return;
    }

    const newMaterial = {
      id: Date.now(),
      title,
      description,
      file,
      studentsVisibleTo: student.split(' '),
      uploadedOn: new Date().toLocaleDateString(),
      releaseDate: 'Available now',
    };

    setMaterials((prevMaterials) => {
      const folderExists = prevMaterials.find((folder) => folder.name === folderName);
      if (folderExists) {
        return prevMaterials.map((folder) =>
          folder.name === folderName
            ? { ...folder, materials: [...folder.materials, newMaterial] }
            : folder
        );
      }
      return [...prevMaterials, { name: folderName, materials: [newMaterial] }];
    });

    if (isNewFolder) {
      setFolders([...folders, newFolderName]);
      setIsNewFolder(false);
      setNewFolderName('');
    }

    setTitle('');
    setDescription('');
    setFile(null);
    setStudent('');
  };

  const handleDelete = (folderName, id) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((folder) =>
        folder.name === folderName
          ? { ...folder, materials: folder.materials.filter((material) => material.id !== id) }
          : folder
      )
    );
  };

  const handleEdit = (folderName, id) => {
    const folderToEdit = materials.find((folder) => folder.name === folderName);
    const materialToEdit = folderToEdit.materials.find((material) => material.id === id);

    setTitle(materialToEdit.title);
    setDescription(materialToEdit.description);
    setFile(materialToEdit.file);
    setStudent(materialToEdit.studentsVisibleTo.join(' '));

    setMaterials((prevMaterials) =>
      prevMaterials.map((folder) =>
        folder.name === folderName
          ? { ...folder, materials: folder.materials.filter((material) => material.id !== id) }
          : folder
      )
    );
  };

  return (
    <div className="container my-5">
      <div className="mb-5">
        <h1 className="text-center text-primary mb-4">My Materials</h1>
        {materials.length > 0 ? (
          materials.map((folder) => (
            <div key={folder.name} className="folder mt-5">
              <h2 className="folder-title text-secondary">{folder.name}</h2>
              <div className="materials">
                {folder.materials.length > 0 ? (
                  folder.materials.map((material) => (
                    <div key={material.id} className="material p-3 my-2 shadow-sm rounded" style={{ backgroundColor: '#f9f9f9' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="material-title fw-bold">{material.title}</span>
                        <div className="actions">
                          <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(folder.name, material.id)}>
                            <FaEdit /> Edit
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(folder.name, material.id)}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                      <div className="material-info mt-2">
                        <p className="mb-1 text-muted">📥 Uploaded on: {material.uploadedOn}</p>
                        <p className="mb-1 text-muted">📅 Scheduled Release: {material.releaseDate}</p>
                        <p className="mb-1 text-muted">🗒 Description: {material.description}</p>
                        <a href="#" className="text-primary">Download {material.file ? material.file.name : 'File'}</a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No materials available.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-danger text-center">You haven't uploaded any materials</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="shadow p-4 rounded" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="mb-4 text-success"><FaUpload /> Upload New Material</h2>
        
        <div className="mb-3">
          <label htmlFor="folderSelect" className="form-label">Select Folder</label>
          <select
            className="form-select"
            aria-label="Select Folder"
            value={selectedFolder}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'new') {
                setIsNewFolder(true);
                setSelectedFolder('');
              } else {
                setIsNewFolder(false);
                setSelectedFolder(value);
              }
            }}
          >
            <option value="" disabled>Select a folder</option>
            {folders.map((folder, index) => (
              <option key={index} value={folder}>{folder}</option>
            ))}
            <option value="new">New Folder</option>
          </select>
        </div>

        {isNewFolder && (
          <div className="mb-3">
            <label htmlFor="newFolderName" className="form-label">New Folder Name</label>
            <input
              type="text"
              className="form-control"
              id="newFolderName"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="materialTitle" className="form-label">Material Title</label>
          <input
            type="text"
            className="form-control"
            id="materialTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">Upload File</label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="materialDescription" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="materialDescription"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="studentSelect" className="form-label">Tag Students</label>
          <input
            type="text"
            className="form-control"
            id="studentSelect"
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            placeholder="student1 student3"
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Submit Material</button>
      </form>
    </div>
  );
};




const MentorFeedback = () => {
  return (
    <p>Forms to submit or view feedback from mentees. Opportunity for self-assessment.</p>
  );
}

const MentorLearning = () => {
  return (
    <p>Learning and development resources for mentors, including tips and recommendations.</p>
  );
}

const MentorReviews = () => {
  return (
    <p>Review feedback from mentees and take actions accordingly.</p>
  );
}
