const dotenv = require('dotenv');
dotenv.config();

const { read_file_to_base64, read_file_to_string, getEmailAddressee } = require('./file.utils')

const pug = require('pug');
var compiled_early_access_email = pug.compileFile('statics/emails/pugs/DEMO-EarlyAccess.pug');

const form_data = require('form-data');
const mail_composer = require('nodemailer/lib/mail-composer');
const mailgun = require('mailgun.js');
const mailgun_domain = 'mailgun.arctics.academy';
const mailgun_config = new mailgun(form_data);
const mailgun_instance = mailgun_config.client({ username: 'api', key: process.env.MAILGUN_API_KEY });


var mapS0CompiledEmail = new Map()
mapS0CompiledEmail.set("S0-Any", pug.compileFile('statics/emails/pugs/S0-Any.pug'))
mapS0CompiledEmail.set("S0-S0-Book-Consultant", pug.compileFile('statics/emails/pugs/S0-S0-Book-Consultant.pug'))
mapS0CompiledEmail.set("S0-S0-Book-Student", pug.compileFile('statics/emails/pugs/S0-S0-Book-Student.pug'))
mapS0CompiledEmail.set("S0-S1-Cancel-Consultant", pug.compileFile('statics/emails/pugs/S0-S1-Cancel-Consultant.pug'))
mapS0CompiledEmail.set("S0-S1-Cancel-Student", pug.compileFile('statics/emails/pugs/S0-S1-Cancel-Student.pug'))
mapS0CompiledEmail.set("S0-S2-Cancel-Consultant", pug.compileFile('statics/emails/pugs/S0-S2-Cancel-Consultant.pug'))
mapS0CompiledEmail.set("S0-S2-Cancel-Student", pug.compileFile('statics/emails/pugs/S0-S2-Cancel-Student.pug'))
mapS0CompiledEmail.set("S0-S2-Pay-Student", pug.compileFile('statics/emails/pugs/S0-S2-Pay-Student.pug'))
mapS0CompiledEmail.set("S0-S3-Cancel-Consultant", pug.compileFile('statics/emails/pugs/S0-S3-Cancel-Consultant.pug'))
mapS0CompiledEmail.set("S0-S3-Cancel-Student", pug.compileFile('statics/emails/pugs/S0-S3-Cancel-Student.pug'))
mapS0CompiledEmail.set("S0-S4-Cancel-Consultant", pug.compileFile('statics/emails/pugs/S0-S4-Cancel-Consultant.pug'))
mapS0CompiledEmail.set("S0-S4-Cancel-Student", pug.compileFile('statics/emails/pugs/S0-S4-Cancel-Student.pug'))

var mapS0TemplateString = new Map()
mapS0TemplateString.set("S0-S0-Book-Consultant", read_file_to_string('statics/emails/texts/S0-S0-Book-Consultant.txt'))
mapS0TemplateString.set("S0-S0-Book-Student", read_file_to_string('statics/emails/texts/S0-S0-Book-Student.txt'))
mapS0TemplateString.set("S0-S1-Cancel-Consultant", read_file_to_string('statics/emails/texts/S0-S1-Cancel-Consultant.txt'))
mapS0TemplateString.set("S0-S1-Cancel-Student", read_file_to_string('statics/emails/texts/S0-S1-Cancel-Student.txt'))
mapS0TemplateString.set("S0-S2-Cancel-Consultant", read_file_to_string('statics/emails/texts/S0-S2-Cancel-Consultant.txt'))
mapS0TemplateString.set("S0-S2-Cancel-Student", read_file_to_string('statics/emails/texts/S0-S2-Cancel-Student.txt'))
mapS0TemplateString.set("S0-S2-Pay-Student", read_file_to_string('statics/emails/texts/S0-S2-Pay-Student.txt'))
mapS0TemplateString.set("S0-S3-Cancel-Consultant", read_file_to_string('statics/emails/texts/S0-S3-Cancel-Consultant.txt'))
mapS0TemplateString.set("S0-S3-Cancel-Student", read_file_to_string('statics/emails/texts/S0-S3-Cancel-Student.txt'))
mapS0TemplateString.set("S0-S4-Cancel-Consultant", read_file_to_string('statics/emails/texts/S0-S4-Cancel-Consultant.txt'))
mapS0TemplateString.set("S0-S4-Cancel-Student", read_file_to_string('statics/emails/texts/S0-S4-Cancel-Student.txt'))

var mapS0Subject = new Map()
mapS0Subject.set("S0-S0-Book-Consultant", "[Arctics Academy升大學顧問平台] 學生預約諮詢通知")
mapS0Subject.set("S0-S0-Book-Student", "[Arctics Academy升大學顧問平台] 諮詢預約成功通知")
mapS0Subject.set("S0-S1-Cancel-Consultant", "[Arctics Academy升大學顧問平台] 學生取消諮詢通知")
mapS0Subject.set("S0-S1-Cancel-Student", "[Arctics Academy升大學顧問平台] 諮詢取消成功通知")
mapS0Subject.set("S0-S2-Cancel-Consultant", "[Arctics Academy升大學顧問平台] 學生取消諮詢通知") 
mapS0Subject.set("S0-S2-Cancel-Student", "[Arctics Academy升大學顧問平台] 諮詢取消成功通知")
mapS0Subject.set("S0-S2-Pay-Student", "[Arctics Academy升大學顧問平台] 付款成功通知")
mapS0Subject.set("S0-S3-Cancel-Consultant", "[Arctics Academy升大學顧問平台] 系統取消諮詢通知")
mapS0Subject.set("S0-S3-Cancel-Student", "[Arctics Academy升大學顧問平台] 系統取消諮詢通知")
mapS0Subject.set("S0-S4-Cancel-Consultant", "[Arctics Academy升大學顧問平台] 學生取消諮詢通知")
mapS0Subject.set("S0-S4-Cancel-Student", "[Arctics Academy升大學顧問平台] 諮詢取消成功通知")


let early_access_email = async (data) => {
    // Build mime message using nodemailer
    let mail_content = 
    {
        from: `"Arctics升學顧問" <hello@mailgun.arctics.academy>`,
        to: `"${data.lastname+data.firstname}" <${data.email}>`,
        subject: `Arctics升學平台 搶先體驗`,
        text: read_file_to_string('statics/emails/texts/DEMO-EarlyAccess.txt'),
        html: compiled_early_access_email(data),
        attachments: 
        [
            {
                filename: `logo.png`,
                encoding: `base64`,
                contentType: `image/png`,
                content: read_file_to_base64('statics/emails/imgs/logo.png'),
                cid: `<logo.png@arctics.academy>`
            }
        ]
    };
    const raw_mime_mail = new mail_composer(mail_content); // converting to MIME
    const compiled_mime_mail = await raw_mime_mail.compile().build();

    // Build mailgun object
    let mail_object = {
        to: [ `"${data.lastname+data.firstname}" <${data.email}>` ],
        message: compiled_mime_mail
    }

    // Send mail through mailgun
    try {
        await mailgun_instance.messages.create(mailgun_domain, mail_object);
    } 
    catch(e) {
        console.log(e);
    }
};


const sendS0Email = async (identifier, consultantObj, studentObj, meetingObj) => {
    // Internal Parameters
    const sendToConsultant = (getEmailAddressee(identifier) === "Consultant" ? true : false)
    const meetingDateObj = new Date() // swap to meetingobj

    // Html & Text Rendering Parameters
    const consultantName = consultantObj.profile.surname+consultantObj.profile.name
    const studentName = studentObj.profile.surname+studentObj.profile.name
    const meetingId = meetingObj.id
    const month = privateToTwoCharString(meetingDateObj.getMonth())
    const date = privateToTwoCharString(meetingDateObj.getDate())
    const hour = privateToTwoCharString(meetingDateObj.getHours())
    const min = privateToTwoCharString(meetingDateObj.getMinutes())
    const data = { consultantName, studentName, meetingId, month, date, hour, min }
    
    // Final Email Data
    const emailName = (sendToConsultant ? 
        consultantObj.profile.surname+consultantObj.profile.name : 
        studentObj.profile.surname+studentObj.profile.name)
    const emailAddress = (sendToConsultant ? consultantObj.profile.email : studentObj.profile.email)
    const emailSubject = mapS0Subject.get(identifier)
    const emailText = eval(mapS0TemplateString.get(identifier))
    const emailHtml = mapS0CompiledEmail.get(identifier)(data)
    
    // Build Mail Object
    let mail_content = 
    {
        from: `"Arctics升學顧問" <hello@mailgun.arctics.academy>`,
        to: `"${emailName}" <${emailAddress}>`,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
        attachments:
        [
            {
                filename: `logo.png`,
                encoding: `base64`,
                contentType: `image/png`,
                content: read_file_to_base64('statics/emails/imgs/logo.png'),
                cid: `<logo.png@arctics.academy>`
            }
        ]
    };
    const raw_mime_mail = new mail_composer(mail_content); // converting to MIME
    const compiled_mime_mail = await raw_mime_mail.compile().build();

    // Build mailgun object
    let mail_object = {
        to: [ `"${emailName}" <${emailAddress}>` ],
        message: compiled_mime_mail
    }

    // Send mail through mailgun
    try {
        await mailgun_instance.messages.create(mailgun_domain, mail_object);
    } 
    catch(e) {
        console.log(e);
    }
}

const privateToTwoCharString = (item) => {
    let itemStr = toString(item)
    if (itemStr.length >= 2) return itemStr
    else return "0" + itemStr
}


module.exports = { 
    early_access_email,
    sendS0Email,
}