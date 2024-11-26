const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aoudiadjahid8@gmail.com',
    pass: 'jnbl muwb umpt fvaf',
  },
});
/*
exports.sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: 'aoudiadjahid8@gmail.com',
    to: email,
    subject: 'Code de vérification',
    text: `Votre code de vérification est : ${code}`,
  };

  

  await transporter.sendMail(mailOptions);
};
*/
exports.sendVerificationEmail = async (email, code) => {
  try {
    // Lire le fichier HTML
    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, 'template-service', 'email.html'), 
      'utf8'
    );

    // Remplacer les placeholders dans le fichier HTML
    const customizedHtml = htmlTemplate.replace('{{code}}', code);

    // Définir les options de l'email
    const mailOptions = {
      from: 'aoudiadjahid8@gmail.com',
      to: email,
      subject: 'Code de vérification',
      html: customizedHtml, // Ajouter le contenu HTML ici
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
  }
};