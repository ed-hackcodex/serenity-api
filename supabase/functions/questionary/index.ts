// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'
import { OpenAI, ChatCompletionOptions } from 'openai'

serve(async (req: Request) => {
  try {
    const { method } = req
    if (method === 'POST') {
      let body
      let messages = []
      try {
        body = await req.json()
        if(body.messages && Array.isArray(body.messages)) {
          messages = body.messages
        } else {
          return new Response(
            JSON.stringify({ status: 400, error: 'messages has to be an Array' }),
            { headers: { "Content-Type": "application/json" }, status: 400 }
          )
        }
      } catch (_error) {
        body = null
      }
      const openAI = new OpenAI(Deno.env.get("OPENAI_API_KEY")!)
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
      )
      const { data: questionnaires, error } = await supabaseClient
        .from('questionnaires')
        .select(`
          *,
          questions (id, text)
        `)
        .eq('id', 1)
      if (error) {
        return new Response(
          JSON.stringify({ status: 500, error }),
          { headers: { "Content-Type": "application/json" }, status: 500 }
        )
      }
      if (!questionnaires[0]) {
        return new Response(
          JSON.stringify({ status: 503, error: 'There is not questionnaires' }),
          { headers: { "Content-Type": "application/json" }, status: 503 }
        )
      }
      const options: ChatCompletionOptions = {
        model: "gpt-4",
        temperature: 0.8,
        messages: [
          {
            "role": "system",
            "content": `You are Karla, a knowledgeable and empathetic mental health companion who specializes in supporting individuals with their mental well-being. As Karla, your goal is to deliver a mental health questionnaire in a conversational way, as it was a conversation between a mental health professional and an individual attending their first consultation.
${JSON.stringify(questionnaires[0])}
Instructions:
1. Start by saying: "Let's explore a few questions together about how you've been feeling over the last two weeks".
2. Using your expertise, adapt the delivery Emulated Initial Screening Questionnaire.
3. Paraphrase each question and deliver it to the user (DO NOT enumerate the questions, you must keep it conversational).
4. Stop after you deliver the question and wait until you get an answer. Once you have received an answer you may continue with the next question.
5. Once you delivered all the questions Assign a  value to each answer using a scale of 0 to 3, where 0 is 'Not at all', 1 is 'Several days', 2 is 'More than half the days', and 3 is 'Nearly every day'.".Do not inform the user of any calculation. Generate a .json output with all the values you have assigned to all the questions.
Formalize (6): Maintain a professional and compassionate tone throughout the questionnaire. Use clear and concise language while also conveying empathy and understanding. When necessary, encourage participants to answer honestly and reassure them that their responses will remain confidential.
Remember, as Karla, you are mental health companion a powerful tool for delivering mental health support. Craft the conversation with empathy, professionalism, and a deep understanding of mental health.`
          }
        ]
      }
      if (messages?.length > 0) {
        options.messages = [...options.messages, ...messages]
      }
      const chatCompletion = await openAI.createChatCompletion(options)

      const response = {
        data: [...messages, chatCompletion.choices[0].message]
      }

      return new Response(
        JSON.stringify(response),
        { headers: { "Content-Type": "application/json" } }
      )
    }
    return new Response(
      JSON.stringify({ status: 404, error: 'Resorce not found' }),
      { headers: { "Content-Type": "application/json" }, status: 404 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 500, error: error }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    )
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
