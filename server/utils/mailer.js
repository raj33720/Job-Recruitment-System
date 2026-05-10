const nodemailer = require("nodemailer");

function getEmailConfig() {
  const sanitizeAppPassword = (value) => String(value || "").replace(/[\s-]/g, "");

  return {
    user: String(process.env.EMAIL_USER || "").trim().toLowerCase(),
    pass: sanitizeAppPassword(process.env.EMAIL_PASS || ""),
  };
}

function isEmailConfigured() {
  const { user, pass } = getEmailConfig();
  return Boolean(user && pass);
}

function createTransporter() {
  const { user, pass } = getEmailConfig();

  if (!user || !pass) {
    throw new Error(
      "Email service is not configured. Set EMAIL_USER and EMAIL_PASS in server/.env"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    host: "sanraj30.04@gmail.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
    },
  });
}

function formatInterviewDate(interviewDate) {
  if (!interviewDate) {
    return "To be announced";
  }

  const rawValue = String(interviewDate).trim();
  const [datePart, timePart] = rawValue.split("T");

  if (!datePart || !timePart) {
    const parsed = new Date(rawValue);
    return Number.isNaN(parsed.getTime()) ? rawValue : parsed.toLocaleString();
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hoursValue, minutesValue = "00"] = timePart.split(":");
  const hours = Number(hoursValue);

  if (!year || !month || !day || Number.isNaN(hours)) {
    const parsed = new Date(rawValue);
    return Number.isNaN(parsed.getTime()) ? rawValue : parsed.toLocaleString();
  }

  const appointmentDate = new Date(year, month - 1, day);
  const formattedDate = appointmentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const normalizedHours = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";
  const minutes = minutesValue.slice(0, 2).padEnd(2, "0");

  return `${formattedDate} at ${normalizedHours}:${minutes} ${period}`;
}

async function sendInterviewScheduleEmail({
  to,
  candidateName,
  role,
  interviewDate,
}) {
  const { user } = getEmailConfig();
  const transporter = createTransporter();
  const scheduledAt = formatInterviewDate(interviewDate);
  const safeCandidateName = candidateName || "Candidate";
  const safeRole = role || "your applied role";

  return transporter.sendMail({
    from: user,
    to,
    subject: `Interview scheduled for ${safeRole}`,
    text: [
      `Hi ${safeCandidateName},`,
      "",
      `Your interview for ${safeRole} has been scheduled for ${scheduledAt}.`,
      "Please check your application progress page for updates.",
      "",
      "Best regards,",
      "Recruitment Team",
    ].join("\n"),
    html: `
      <p>Hi ${safeCandidateName},</p>
      <p>Your interview for <strong>${safeRole}</strong> has been scheduled for <strong>${scheduledAt}</strong>.</p>
      <p>Please check your application progress page for updates.</p>
      <p>Best regards,<br />Recruitment Team</p>
    `,
  });
}

module.exports = {
  isEmailConfigured,
  sendInterviewScheduleEmail,
};
