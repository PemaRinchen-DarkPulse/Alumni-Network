import React from "react";
import { useState } from "react";
import { Form, FormGroup, Label, Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/register", { name, email, password, confirmPassword }) 
        try{
            console.log("successful")
        }
        catch (err){
            console.log(err)
        }
    }

    return (
        <div className="auth-container">
            <h2 className="text-center fw-bold">Sign Up</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label for="name" className="fw-bold">Name:</Label>
                    <Input id="name" name="name" placeholder="John Doe" type="text" onChange={(e) => setName(e.target.value)} />
                </FormGroup>
                <FormGroup row>
                    <Label for="email" className="fw-bold">Email:</Label>
                    <Input id="email" name="email" placeholder="johndoe@example.com" type="email" onChange={(e) => setEmail(e.target.value)} />
                </FormGroup>
                <FormGroup row>
                    <Label for="pass" className="fw-bold">Password:</Label>
                    <Input id="pass" name="password" placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                </FormGroup>
                <FormGroup row>
                    <Label for="conpass" className="fw-bold">Confirm Password:</Label>
                    <Input id="conpass" name="confirmPassword" placeholder="password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </FormGroup>
                <Button color="primary" block>Sign Up</Button>
            </Form>
            <p>Already have an account? <Link to="/login">Login here</Link>.</p>
        </div>
    );
}

export const Login = () => {
    return (
        <div className="auth-container">
            <h2 className="text-center fw-bold">Log In</h2>
            <Form>
                <FormGroup row>
                    <Label for="email" className="fw-bold">Email:</Label>
                    <Input id="email" name="email" placeholder="johndoe@example.com" type="email" />
                </FormGroup>
                <FormGroup row>
                    <Label for="pass" className="fw-bold">Password:</Label>
                    <Input id="pass" name="password" placeholder="password" type="password" />
                </FormGroup>
                <Button color="primary" block>Log In</Button>
            </Form>
            <p>Don't have an account? <Link to="/register">Sign up here</Link>.</p>
        </div>
    );
}

export const SignUpAsMentor = () => {
    return (
        <div>
            <h2>Sign Up as a Mentor</h2>
            <Form>
                <FormGroup>
                    <Label for="name" className="fw-bold">Name:</Label>
                    <Input id="name" name="name" placeholder="John Doe" type="text" required />
                </FormGroup>
                <FormGroup>
                    <Label for="email" className="fw-bold">Email:</Label>
                    <Input id="email" name="email" placeholder="johndoe@example.com" type="email" required />
                </FormGroup>

                <FormGroup>
                    <Label for="background" className="fw-bold">Professional Background:</Label>
                    <Input id="background" name="background" type="select" required>
                        <option value="Software Development">Software Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Project Management">Project Management</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                <Label for="availability">Availability (Hours Per Week):</Label>
                <Input type="number" id="availability" name="availability" min="1" required/>
                </FormGroup>
                <Button color="primary" block>Sign Up</Button>
            </Form>
        </div>
    );
};
export const SignUpAsMentee=()=>{
    return (
        <div>
            <h2>Sign Up as a Mentee</h2>
            <Form>
                <FormGroup>
                    <Label for="name" className="fw-bold">Name:</Label>
                    <Input id="name" name="name" placeholder="John Doe" type="text" required />
                </FormGroup>
                <FormGroup>
                    <Label for="email" className="fw-bold">Email:</Label>
                    <Input id="email" name="email" placeholder="johndoe@example.com" type="email" required />
                </FormGroup>
                <FormGroup>
                    <Label for="name" className="fw-bold">Name:</Label>
                    <Input id="name" name="name" placeholder="John Doe" type="text" required />
                </FormGroup>
                <Button color="primary" block>Sign Up</Button>
            </Form>
        </div>
    );
}

export const Contact = () => {
    return (
        <section id="contact-me" className="mb-5">
            <div className="container-md contact-form">
                <div className="d-flex justify-content-center">
                    <div className="col-md-8">
                        <h1 className="text-center">Leave Your Message</h1>
                        <form action="">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="first-name" className="form-label">First Name</label>
                                    <input type="text" id="first-name" className="form-control" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="last-name" className="form-label">Last Name</label>
                                    <input type="text" id="last-name" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" id="email" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label htmlFor="phone-number" className="form-label">Phone Number</label>
                                    <input type="number" id="phone-number" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea id="message" className="form-control" rows="6"></textarea>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <button type="submit" className="btn btn-primary">Contact Us</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
