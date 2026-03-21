// backend/utils/mailer.js
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const Jimp = require("jimp");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const ticketImages = {
  "Love Tribe": "love_tribe.jpeg",
  "Grace Tribe": "grace_tribe.jpeg",
  "Peace Tribe": "peace_tribe.jpeg",
  "Bond Tribe": "bond_tribe.jpeg",
  "Fire Tribe": "fire_tribe.jpeg",
  "Light Tribe": "light_tribe.jpeg",
  "Joy Tribe": "joy_tribe.jpeg",
  "Healing Tribe": "healing_tribe.jpeg",
};

const sendTicketEmail = async (recipientEmail, applicantName, tableChoice) => {
  try {
    const templatePath = path.join(__dirname, "../templates/ticket.ejs");
    const fileName = ticketImages[tableChoice] || "love_tribe.jpeg";
    const baseImagePath = path.join(__dirname, `../assets/tickets/${fileName}`);

    // ==========================================
    // 1. Dynamic Image Generation with Jimp
    // ==========================================

    const image = await Jimp.read(baseImagePath);

    // DOWNGRADED FONT: 32px is much more proportional for a sleek tag
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    const text = applicantName.toUpperCase();

    const textWidth = Jimp.measureText(font, text);
    const textHeight = Jimp.measureTextHeight(font, text, textWidth);

    // TIGHTER PADDING: Makes it look like a sleek modern label
    const paddingX = 40;
    const paddingY = 20;

    const boxWidth = textWidth + paddingX;
    const boxHeight = textHeight + paddingY;

    // TRUE CENTERING MATH:
    // 0.63 centers it perfectly within the red area (ignoring the yellow sidebar)
    // 0.55 is the exact middle of the gap between the ribbon and the bottom swirl
    // Change 0.55 to 0.59 to push the box downward away from the ribbon
    const centerX = image.bitmap.width * 0.63;
    const centerY = image.bitmap.height * 0.565;

    // Calculate top-left starting points by subtracting half the box size
    const tagX = centerX - boxWidth / 2;
    const tagY = centerY - boxHeight / 2;

    // Create the sleek white tag
    const whiteTag = await new Promise((resolve, reject) => {
      new Jimp(boxWidth, boxHeight, "#FFFFFF", (err, img) => {
        if (err) reject(err);
        else resolve(img);
      });
    });

    // Paste the tag and print the text
    image.composite(whiteTag, tagX, tagY);
    image.print(font, tagX + paddingX / 2, tagY + paddingY / 2, text);

    const ticketBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    // ==========================================

    const htmlContent = await ejs.renderFile(templatePath, {
      applicantName: applicantName || "Worker",
      tableChoice: tableChoice || "General Seating",
    });

    await transporter.sendMail({
      from: `"Excellence Conference" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Your Official Ticket: Excellence Conference Workers Dinner",
      html: htmlContent,
      attachments: [
        // Attachment 1: The "Inline" version that shows up inside the email body
        {
          filename: `${applicantName.replace(/\s+/g, "_")}_Ticket.png`,
          content: ticketBuffer,
          cid: "customizedTicket",
          contentDisposition: "inline",
        },
        // Attachment 2: The "Standard" version that forces a Download button at the bottom
        {
          filename: `${applicantName.replace(/\s+/g, "_")}_Ticket_Download.png`,
          content: ticketBuffer,
          contentDisposition: "attachment",
        },
      ],
    });

    console.log(
      `Customized ${tableChoice} ticket successfully sent to ${recipientEmail}`,
    );
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${recipientEmail}:`, error);
    return false;
  }
};

module.exports = { sendTicketEmail };
