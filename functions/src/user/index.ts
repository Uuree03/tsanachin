/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { User } from "../models/user.model";

const mail = encodeURIComponent(functions.config().gmail.email);
const password = encodeURIComponent(functions.config().gmail.password);
const transporter = nodemailer.createTransport(`smtps://${mail}:${password}@smtp.gmail.com`);

// firebase functions:config:set gmail.email="mail" gmail.password="password"
// nwpkwaayyuljycbw

export const inviteUser = functions.firestore.document("invitedUsers/{userId}").onCreate((snap) => {
  const val = snap.data();
  const html = `
  <p>Сайн байна уу,</p>
  <p><strong>${val.name}</strong> таньд клубын сайтын хэрэглэгч болох урилга илгээж байна. <br>
  Доорх холбоосоор орж өөрийн мэдээллийг бөглөж хэрэглэгчээр бүртгүүлнэ үү.</p>
  <br>
  <p>Бүртгүүлэх хаяг: <a href="tsanachin-club.web.app/signup/${snap.id}">tsanachin-club.web.app/signup/${snap.id}</a></p>

  <p>Цаначин Клуб</p>
  `;

  const mailOptions = {
    from: "\"Цаначин Клуб\" tsanachinclub@gmail.com",
    to: val.email,
    subject: "Шинэ хэрэглэгчийн бүртгэл",
    html: html,
  };
  return transporter.sendMail(mailOptions)
      .then(() => {
        return console.log("Mail sent to: "+val.email);
      });
});

export const createUserProfile = functions.https.onCall((data) => {
  const newUser: User = {
    lastName: data.lastName,
    firstName: data.firstName,
    nickname: data.nickname,
    phone: data.phone,
    position: data.position,
    email: data.email,
    roles: data.roles,
  };
  return admin.firestore().collection("users").doc(data.id).set(newUser).then(() => {
    return admin.firestore().doc("invitedUsers/"+data.invitationId).delete();
  }).then(() => {
    const html = `
    <h2 style="color:blue;">Цаначин клубын системд морилно уу,</h2>
    <p><strong>${data.lastName}</strong> <strong><span style="text-transform:uppercase">${data.firstName}</span></strong>
     Та tsanachin-club.web.app системд хэрэглэгчээр бүртгэгдлээ. <br>
    <br>
    <h3 style="color:red;">Аюулгүй байдлын санамж</h3>
    <ul>
      <li>Хэрэглэгч нэвтрэх нууц үгээ бусдад алдахааргүй найдвартай байдлаар бичиж тэмдэглэх хэрэгтэй.</li>
      <li>Хэрэв та нийтийн болон бусдын компьютер, зөөврийн төхөөрөмж ашиглан нэвтэрсэн бол
      өөрийн нэр дээр дарж <strong>Гарах</strong> гэсэн командаар нэвтрэлтээ цуцалж гарах ёстой.</p>
    </ul>
    <br>
    <p>Таньд амжилт хүсье!</p>
    `;

    const mailOptions = {
      from: "\"Цаначин Клуб\" tsanachinclub@gmail.com",
      to: data.email,
      subject: "Хэрэглэгч бүртгэгдлээ",
      html: html,
    };
    return transporter.sendMail(mailOptions);
  }).then(() => {
    return console.log("Mail sent to: new user");
  });
});

export const deleteUser = functions.firestore.document("users/{userId}").onDelete((snap) => {
  const val = snap.data();
  const html = `
    <p><strong>${val.lastName} ${val.firstName}</strong> таныг сайтын хэрэглэгчээс хасч байна. <br>
    Хэрэв андуурал гарсан бол админд хандана уу.</p>
    <br>
    <p>Хэрэглэгчийн түлхүүр: ${snap.id}</p>
    <br>
    <p>Цаначин Клуб</p>
  `;

  const mailOptions = {
    from: "\"Цаначин Клуб\" tsanachinclub@gmail.com",
    to: val.email,
    subject: "Хэрэглэгч хасалт",
    html: html,
  };
  return admin.auth().deleteUser(snap.id)
      .then(() => {
        console.log("User deleted");
        return transporter.sendMail(mailOptions);
      })
      .then(() => {
        return console.log("Mail sent to "+val.email);
      });
});
