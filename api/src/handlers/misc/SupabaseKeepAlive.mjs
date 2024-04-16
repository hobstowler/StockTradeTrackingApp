import {createClient} from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_API_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const handler = async (event, context, callback) => {
  const {error} = await supabase
    .from('keep-alive')
    .update({updated_at: new Date()})
    .eq('id', 1)

  if (error) {
    console.log(error)
    return 500
  }

  console.log('Success')
  return 200
}