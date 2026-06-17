import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendQuoteNotificationEmail(quoteData: {
  name: string;
  phone: string;
  email?: string;
  building?: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'votre-email@exemple.com';
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Garnier Nettoyage <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `Nouveau Devis : ${quoteData.name}`,
      html: `
        <h1>Nouveau devis reçu !</h1>
        <p>Une nouvelle demande de devis a été soumise sur le site.</p>
        <hr />
        <p><strong>Nom :</strong> ${quoteData.name}</p>
        <p><strong>Téléphone :</strong> ${quoteData.phone}</p>
        <p><strong>Email :</strong> ${quoteData.email || 'Non renseigné'}</p>
        <p><strong>Bâtiment :</strong> ${quoteData.building || 'Non renseigné'}</p>
        <p><strong>Message :</strong></p>
        <p>${quoteData.message.replace(/\n/g, '<br>')}</p>
        <hr />
        <p><a href="${process.env.VITE_APP_URL || ''}/admin">Accéder au Dashboard</a></p>
      `,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
}

export async function sendClientMessageEmail(clientData: {
  email: string;
  name: string;
  message: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Garnier Nettoyage <onboarding@resend.dev>',
      to: [clientData.email],
      subject: `Message de Garnier Nettoyage`,
      html: `
        <h1>Bonjour ${clientData.name},</h1>
        <p>Vous avez reçu un nouveau message de la part de Garnier Nettoyage concernant votre demande de devis.</p>
        <hr />
        <p><strong>Message :</strong></p>
        <p>${clientData.message.replace(/\n/g, '<br>')}</p>
        <hr />
        <p>Cordialement,<br />L'équipe Garnier Nettoyage</p>
      `,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email au client:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception lors de l\'envoi de l\'email au client:', error);
    return { success: false, error };
  }
}
