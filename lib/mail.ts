


import {Resend} from "resend";

const resend = new Resend(process.env.RESENT_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (
    email: string, 
    token: string
)=>{
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject : "Confirm your email!",
        html: `<p>Click<a href="${confirmLink}">here</a>to confirm eamil. </p>`
    })
}


export const sendPasswordResetEmail = async (
    email: string,
    token: string
) =>{
    const resetLink = `${domain}/auth/new-password?token=${token}`;
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject : "Reset your password!",
        html: `
        <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            Click 
            <a href="${resetLink}" style="color: #1a73e8; font-weight: bold; text-decoration: none;">
            here
            </a> to confirm your email.
        </p>
        `
    })
}


export const sendTwoFactorTokenEmail = async(
    email:string, 
    token:string,
)=>{
   
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject : "2FA Code",
        html: `
        <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            Your 2FA code: ${token}
        </p>
        `
    })
}