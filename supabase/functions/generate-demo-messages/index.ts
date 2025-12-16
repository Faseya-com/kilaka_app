import { createClient } from 'npm:@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Non autorisé');
    }

    const demoUsers = [
      {
        email: 'marie.designer@demo.com',
        full_name: 'Marie Dubois',
        password: 'demo123456',
        messages: [
          'Bonjour! J\'ai vu votre annonce pour un projet de site web. Je suis disponible pour en discuter.',
          'Je peux vous envoyer mon portfolio si vous le souhaitez.',
        ],
      },
      {
        email: 'jean.developer@demo.com',
        full_name: 'Jean Martin',
        password: 'demo123456',
        messages: [
          'Salut! Je suis développeur freelance avec 5 ans d\'expérience.',
          'Quand pouvons-nous organiser un appel pour discuter de votre projet?',
        ],
      },
      {
        email: 'sophie.marketing@demo.com',
        full_name: 'Sophie Laurent',
        password: 'demo123456',
        messages: [
          'Bonjour, j\'ai une expertise en marketing digital et SEO.',
          'Je peux vous aider à améliorer votre visibilité en ligne.',
        ],
      },
    ];

    for (const demoUser of demoUsers) {
      let userId: string;

      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', demoUser.email)
        .maybeSingle();

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: demoUser.email,
          password: demoUser.password,
          email_confirm: true,
        });

        if (authError) {
          console.error('Error creating user:', authError);
          continue;
        }

        userId = authData.user.id;

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: demoUser.email,
            full_name: demoUser.full_name,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          continue;
        }
      }

      for (const messageContent of demoUser.messages) {
        await supabase
          .from('messages')
          .insert({
            sender_id: userId,
            receiver_id: user.id,
            content: messageContent,
          });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Messages de démonstration générés avec succès',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
