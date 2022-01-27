import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { adminData } from '../server';

//////////// EMAILING ////////////

// ETHEREAL
export const etherealTransporterInit = (status: string, userInfo: any) => {
  const userData: any = JSON.stringify(userInfo);
  const etherealTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: adminData.emailEthereal.address,
      pass: adminData.emailEthereal.password,
    },
  });

  const date = new Date().toLocaleString('es-AR');
  const message = `${userData} hizo ${status} el: ${date}`;

  const mailOptions = {
    from: 'Prueba',
    to: adminData.emailEthereal.address,
    subject: status,
    html: message,
  };

  etherealTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);

      return error;
    }

    return;
  });
};

// GMAIL

export const gmailTransporterInit = (userData: any) => {
  const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: adminData.emailGmail.address,
      pass: adminData.emailGmail.password,
    },
  });

  const mailOptions: any = {
    to: 'email2cristian@gmail.com',
    subject: 'login',
    html: `<h1>El usuario ${userData.email} se ah logueado</h1>`,
  };
  const attachmentPath = userData.avatar;
  if (attachmentPath) {
    mailOptions.attachments = [
      {
        path: attachmentPath,
      },
    ];
  }

  gmailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);

      return error;
    }

    return;
  });
};

// TWILIO (SMS)

export const sendSms = (info: any, text: any, phoneNumber: any) => {
  const userDatail: any = JSON.stringify(info);
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  (async () => {
    try {
      const message = await client.messages.create({
        body: `Detalle: ${userDatail} asunto: "${text}"`,
        from: '+12183282116',
        to: phoneNumber,
      });
      console.log(message.sid);
    } catch (error) {
      console.log(error);
    }
  })();
};

// TWILIO (WHATSAPP)

export const sendWhatapp = (detalleDeCompra: any) => {
  const detalle: any = JSON.stringify(detalleDeCompra);

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  (async () => {
    try {
      const message = await client.messages.create({
        body: detalle,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${adminData.whatsappNumber}`,
      });
      console.log(message.sid);
    } catch (error) {
      console.log(error);
    }
  })();
};

export default {
  etherealTransporterInit,
  gmailTransporterInit,
  sendSms,
  sendWhatapp,
};
