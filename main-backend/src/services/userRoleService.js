const supabaseAdmin = require('../config/supabase');

async function findUserRoleRecord({ userId, email }) {
  if (!userId && !email) {
    return { record: null, error: new Error('Missing user identity') };
  }

  let query = supabaseAdmin
    .from('user_roles')
    .select('user_id, role, email')
    .limit(1);

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (email) {
    query = query.eq('email', email);
  }

  let { data, error } = await query.maybeSingle();

  if (error) {
    return { record: null, error };
  }

  if (!data && userId && email) {
    const fallback = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role, email')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    return { record: null, error };
  }

  return { record: data || null, error: null };
}

module.exports = {
  findUserRoleRecord,
};
