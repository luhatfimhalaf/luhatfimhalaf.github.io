// Test file untuk debug contact form
// Buka di browser console untuk test form functionality

// Test data
const testFormData = {
    name: "Test User",
    email: "test@example.com", 
    projectType: "web-app",
    message: "This is a test message for portfolio contact form"
};

// Function untuk test form validation
function testFormValidation() {
    const form = document.getElementById('contactForm');
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const projectTypeInput = form.querySelector('#projectType');
    const messageInput = form.querySelector('#message');
    
    // Fill form with test data
    nameInput.value = testFormData.name;
    emailInput.value = testFormData.email;
    projectTypeInput.value = testFormData.projectType;
    messageInput.value = testFormData.message;
    
    console.log('Form filled with test data');
    console.log('Name:', nameInput.value);
    console.log('Email:', emailInput.value);
    console.log('Project Type:', projectTypeInput.value);
    console.log('Message:', messageInput.value);
}

// Function untuk test form submission (tanpa actual submit)
function testFormSubmission() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        projectType: formData.get('projectType'),
        description: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    console.log('Form data that would be sent:', data);
    return data;
}

// Instructions
console.log('=== PORTFOLIO CONTACT FORM TESTING ===');
console.log('1. Run testFormValidation() to fill form with test data');
console.log('2. Run testFormSubmission() to see what data would be sent');
console.log('3. Manually test the form submission');
console.log('=====================================');
