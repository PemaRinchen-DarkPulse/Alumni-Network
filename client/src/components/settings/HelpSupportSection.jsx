import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Accordion component
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border rounded-md">
          <button
            className="flex justify-between w-full px-4 py-3 text-left text-sm font-medium"
            onClick={() => toggleItem(index)}
            aria-expanded={openIndex === index}
          >
            <span>{item.question}</span>
            <span>{openIndex === index ? '−' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-sm">
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const HelpSupportSection = () => {
  
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // FAQ items
  const faqItems = [
    {
      question: "How do I update my profile information?",
      answer: "You can update your profile information from the Profile tab in the Settings page. Click on the Edit Profile button to make changes to your information."
    },
    {
      question: "How can I become a mentor?",
      answer: "If you're an alumni, you can express interest in becoming a mentor by enabling the 'Open to Mentoring' option in the Networking tab of your Settings."
    },
    {
      question: "How do I change my password?",
      answer: "You can change your password from the Password tab in the Settings page. You'll need to enter your current password and then your new password twice for confirmation."
    },
    {
      question: "How can I control who sees my information?",
      answer: "You can control the visibility of your personal information from the Privacy tab in the Settings page. You can toggle which information is visible to other users."
    },
    {
      question: "How do I delete my account?",
      answer: "You can delete your account from the Privacy tab in the Settings page. Look for the Delete Account option. Note that this action is permanent and cannot be undone."
    }
  ];
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
    // Submit contact form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      setMessage({
        type: 'error',
        text: 'Please fill in all fields'
      });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Backend removed
      const response = { success: false, error: 'Backend removed - support contact unavailable' };
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: 'Your message has been sent! Our support team will get back to you soon.' 
        });
        
        // Reset form
        setContactForm({
          subject: '',
          message: ''
        });
      } else {
        throw new Error(response.error || 'Failed to submit your message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting support request:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to submit your message. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find answers to common questions about using the Alumni Network
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Accordion items={faqItems} />
        </CardContent>
      </Card>
      
      {/* Contact Support Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Can't find what you're looking for? Send us a message and we'll get back to you
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {message.text && (
            <div className={`mb-4 p-3 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Subject</label>
              <Input
                name="subject"
                value={contactForm.subject}
                onChange={handleChange}
                placeholder="What's your question about?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Message</label>
              <Textarea
                name="message"
                value={contactForm.message}
                onChange={handleChange}
                placeholder="Please describe your issue or question in detail"
                rows={5}
                required
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Helpful Resources</CardTitle>
          <CardDescription>
            Additional resources to help you get the most out of the Alumni Network
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/help/user-guide" 
              className="block p-4 border rounded-md hover:bg-accent transition-colors"
            >
              <h3 className="text-sm font-semibold mb-1">User Guide</h3>
              <p className="text-xs text-muted-foreground">
                Comprehensive guide to using all features of the Alumni Network
              </p>
            </a>
            
            <a 
              href="/help/mentorship" 
              className="block p-4 border rounded-md hover:bg-accent transition-colors"
            >
              <h3 className="text-sm font-semibold mb-1">Mentorship Guide</h3>
              <p className="text-xs text-muted-foreground">
                Learn how to get the most out of the mentorship program
              </p>
            </a>
            
            <a 
              href="/help/events" 
              className="block p-4 border rounded-md hover:bg-accent transition-colors"
            >
              <h3 className="text-sm font-semibold mb-1">Event Participation</h3>
              <p className="text-xs text-muted-foreground">
                Tips for organizing and participating in alumni events
              </p>
            </a>
            
            <a 
              href="/help/privacy" 
              className="block p-4 border rounded-md hover:bg-accent transition-colors"
            >
              <h3 className="text-sm font-semibold mb-1">Privacy & Security</h3>
              <p className="text-xs text-muted-foreground">
                Learn about our privacy practices and how to keep your account secure
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupportSection;
