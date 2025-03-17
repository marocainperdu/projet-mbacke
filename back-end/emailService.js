const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // ou autre service
    auth: {
        user: 'lloydniang@gmail.com', // Remplacer par votre email
        pass: 'yjvm jogr ueyo ofoq' // Remplacer par votre mot de passe
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'lloydniang@gmail.com', // Remplacer par votre email
        to: to.join(', '), // Gère un tableau d'emails
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email envoyé à', to);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
};

module.exports = { sendEmail };