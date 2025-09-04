-- Create missing identity for the admin email/password user
WITH u AS (
  SELECT id, email FROM auth.users WHERE email = 'itz0jere@gmail.com'
)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  'email',
  u.email,
  now(),
  now(),
  now()
FROM u
ON CONFLICT (provider, provider_id) DO NOTHING;