// ========== SUPABASE AUTH ==========
async function loadCurrentUser() {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
      user = null;
      userCredits = 0;
      currentPlan = 'free';
      updateNav();
      return;
    }
    const { data: profile } = await supabaseClient
      .from('profiles').select('*').eq('id', session.user.id).single();
    const { data: userPlans } = await supabaseClient
      .from('plans').select('*').eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    user = {
      id: session.user.id,
      email: session.user.email,
      name: ((profile?.first_name || '') + ' ' + (profile?.last_name || '')).trim() || session.user.email.split('@')[0],
    };
    currentPlan = profile?.plan || 'free';
    userCredits = profile?.credits || 0;
    plansHistory = (userPlans || []).map(p => ({ ...p.sections, id: p.id, timestamp: new Date(p.created_at).getTime(), nom_entreprise: p.name, score_viabilite: p.score }));

    updateNav();
    updateUsage();
    updateDashHeader();
  } catch(e) {
    console.error('loadCurrentUser error:', e);
  }
}

