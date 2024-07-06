const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

app.post('/api/referrals', async (req, res) => {
  const { referrerName, referrerEmail, friendName, friendEmail } = req.body;

  try {
    const newReferral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        friendName,
        friendEmail,
      },
    });

    // Send referral email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'saddyshuii@gmail.com',
        pass: 'fnscrorwsbclogyf',
      },
    });

    const mailOptions = {
      from: 'saddyshuii@gmail.com',
      to: friendEmail,
      subject: 'You have been referred!',
      text: `Hi ${friendName},\n\nYou have been referred by ${referrerName}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error sending email');
      }
      res.status(200).json(newReferral);
    });
  } catch (error) {
    res.status(400).send('Error creating referral');
  }
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});