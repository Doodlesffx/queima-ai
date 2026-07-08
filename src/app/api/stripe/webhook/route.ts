import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendProConfirmationEmail } from '@/lib/resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Usa service key para bypass de RLS — só usado aqui no servidor
function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'Sem assinatura' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature inválida:', err);
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 });
  }

  const supabase = adminSupabase();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession;
      const userId  = session.subscription
        ? await getUserIdFromSubscription(session.subscription as string)
        : null;

      const uid = userId ?? session.metadata?.supabase_user_id;
      if (uid) {
        await supabase.from('users').update({
          plan: 'pro',
          stripe_subscription_id: session.subscription as string,
        }).eq('id', uid);

        // Email de confirmação PRO (fire-and-forget)
        const email = session.customer_details?.email;
        const name  = session.customer_details?.name || email?.split('@')[0] || 'Usuário';
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
        const planName = lineItems.data[0]?.description ?? 'PRO';
        if (email) {
          sendProConfirmationEmail(email, name, planName).catch((err) =>
            console.error('Erro ao enviar email PRO:', err)
          );
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const uid = sub.metadata?.supabase_user_id;
      if (uid) {
        const plan = sub.status === 'active' ? 'pro' : 'free';
        await supabase.from('users').update({ plan }).eq('id', uid);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const uid = sub.metadata?.supabase_user_id;
      if (uid) {
        await supabase.from('users').update({
          plan: 'free',
          stripe_subscription_id: null,
        }).eq('id', uid);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn('Pagamento falhou para customer:', invoice.customer);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function getUserIdFromSubscription(subscriptionId: string): Promise<string | null> {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  return sub.metadata?.supabase_user_id ?? null;
}
