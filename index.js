const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

const templateDirectory = path.resolve(__dirname, 'template.hbs');
fs.promises.readFile(templateDirectory, { encoding: 'utf-8' }).then((readableTemplate) => {
  const convertTemplate = handlebars.parse(readableTemplate)
  const template = convertTemplate.body[0].original;

  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ', + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    let transporter = nodemailer.createTransport({
      host: account.smtp.host,
      post: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      }
      
    });

    let message = {
      from: 'Seminovos B2B <noreply@b2b.com>',
      to: 'John Doe <johndoe@example.com>',
      subject: 'Troca de senha',
      text: 'Troca de senha',
      html: template,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ', + err.message);
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId)
      console.log('Previer URL: %s', nodemailer.getTestMessageUrl(info));
    })
  });
});