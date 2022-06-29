import mailer from 'nodemailer';
import logger from './logger.js';

const mailSender = mailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.ADMIN_MAIL,
    pass: process.env.ADMIN_MAIL_PWD,
  },
});

const mailData = {
  from: 'E-Commerce Server',
  to: process.env.ADMIN_MAIL,
  subject: 'Nuevo registro',
  html: '',
};

export default async function sendMail(data, type) {
  let html = '';
  switch (type) {
    case 'user':
      html = `Se informa la creación de un nuevo usuario.<br /><br />`;
      html += `<ul>`;
      html += `<li>Mail: ${data.user}</li>`;
      html += `<li>Nombre: ${data.name}</li>`;
      html += `<li>Edad: ${data.age}</li>`;
      html += `<li>Domicilio: ${data.address}</li>`;
      html += `<li>Teléfono: ${data.phoneNmbr}</li>`;
      html += `</ul>`;
      break;

    case 'order':
      break;
    default:
      break;
  }
  mailData.html = html;
  try {
    await mailSender.sendMail(mailData);
    logger.info('New registered user email successfully sent');
  } catch (err) {
    logger.error(err);
  }
}
