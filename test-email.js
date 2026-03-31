// Test script to send a test email through Firebase
// Run this after installing the extension

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./path-to-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function sendTestEmail() {
  try {
    await db.collection('emails').add({
      to: 'andrej.radinger@gmail.com', // Your test email
      message: {
        subject: 'Test Email - Infinity Crochet',
        text: 'This is a test email from Firebase Extension',
        html: '<h1>Test Successful!</h1><p>Your email system is working!</p>',
      },
    });
    
    console.log('✅ Test email queued successfully!');
    console.log('Check your email inbox in a few seconds.');
  } catch (error) {
    console.error('❌ Error sending test email:', error);
  }
}

sendTestEmail();
