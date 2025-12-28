import 'dotenv/config';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_MAIL = process.env.RESEND_MAIL;

if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined');
}

if (!RESEND_MAIL) {
    throw new Error('RESEND_MAIL is not defined');
} 

const resend = new Resend(RESEND_API_KEY);

// (async function () {
//     const { data, error } = await resend.emails.send({
//         from: 'Acme <onboarding@resend.dev>',
//         to: ['delivered@resend.dev'],
//         subject: 'Hello World',
//         html: '<strong>It works!</strong>',
//     });

//     if (error) {
//         return console.error({ error });
//     }

//     console.log({ data });
// })();

export async function sendMail(to, subject, html) {
    console.log(`🛠️ Function Calling ... \n To: ${to} \n Subject: ${subject} \n Body: ${html}`);
    
    try {
        const { data, error } = await resend.emails.send({
            from: `Weather Agent <${RESEND_MAIL}>`,
            to: to,
            subject,
            html,
        });

        if (error) {
            console.error({ error });
            return error.message;
        }

        return {
            status: "success",
            data
        };
    } catch (error) {
        console.error(error);
        return {
            status: "failed",
            error: err.message
        };
    }
}