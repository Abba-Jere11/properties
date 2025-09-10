import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateClientRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the caller is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if caller is admin using the anon key client
    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid auth token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Admin check: verify role using service-role client (no session required)
    const { data: adminProfile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('user_id', user.id)
      .single()

    if (profileFetchError || !adminProfile || adminProfile.role !== 'admin' || adminProfile.is_active !== true) {
      console.error('Admin check failed:', profileFetchError, adminProfile)
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { email, password, first_name, last_name, phone, address }: CreateClientRequest = await req.json()

    console.log(`Creating client user: ${email}`)

    // Create auth user with service role key
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name,
        last_name
      }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!newUser.user) {
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Upsert profile (create or update if it already exists on user_id)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: newUser.user.id,
          email,
          first_name,
          last_name,
          phone: phone || null,
          address: address || null,
          role: 'client',
          is_active: true,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )

    if (profileError) {
      console.error('Profile upsert error:', profileError)
      // Do not fail the whole operation if profile already existed; continue with success response
    }

    console.log(`Successfully created client user: ${email} with ID: ${newUser.user.id}`)

    return new Response(
      JSON.stringify({ 
        message: 'Client created successfully',
        user_id: newUser.user.id,
        email: email
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-client-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})