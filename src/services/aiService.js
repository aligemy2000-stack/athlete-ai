import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

// Initialize the clients using the keys from .env
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

let geminiClient = null;
if (geminiApiKey) {
  // Explicitly use v1 to avoid v1beta issues reported by the user
  geminiClient = new GoogleGenAI({ apiKey: geminiApiKey, apiVersion: 'v1' });
}

let groqClient = null;
if (groqApiKey) {
  groqClient = new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true });
}


// Ensure the AI always responds with this EXACT JSON shape so the UI doesn't break
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    schedule: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "string" },
          type: { type: "string", description: "Must be exactly 'Training' or 'Rest'" },
          focus: { type: "string" },
          muscleTargets: { type: "array", items: { type: "string" } },
          exercises: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                sets: { type: "string" },
                reps: { type: "string" },
                rest: { type: "string" },
                notes: { type: "string", description: "Professional fitness coach cue for form and intention" }
              },
              required: ["name", "sets", "reps", "rest", "notes"]
            }
          }
        },
        required: ["day", "type", "focus", "muscleTargets", "exercises"]
      }
    },
    positionFocus: {
      type: "object",
      properties: {
        label: { type: "string" },
        muscles: { type: "array", items: { type: "string" } }
      },
      required: ["label", "muscles"]
    },
    nutritionTips: { type: "array", items: { type: "string" } },
    recoveryTips: { type: "array", items: { type: "string" } },
    warmup: { type: "string" },
    cooldown: { type: "string" }
  },
  required: ["schedule", "positionFocus", "nutritionTips", "recoveryTips", "warmup", "cooldown"]
};

export const generateWorkoutProgram = async (formData) => {
  // If no API key was provided in .env, throw an error
  if (!geminiClient && !groqClient) {
    throw new Error("Missing API keys in .env file (Gemini or Groq required)");
  }

  const { sport, position, days, level, age, height, weight, goals, hasInjury, injuryDetails, equipment } = formData;
  const goalsText = Array.isArray(goals) ? goals.join(', ') : goals;

  const systemInstruction = `
You are a world-class, professional Strength & Conditioning Coach.
Your task is to build a highly personalised, elite-tier weekly training program based on the athlete's exact profile.

RULES FOR THE SCHEDULE:
1. They train ${days} days per week. The rest are Recovery/Rest days.
2. Space the rest days intelligently based on their level (${level}):
   - Beginner: Max 2 consecutive training days
   - Intermediate: Max 3 consecutive training days
   - Advanced: Max 4 consecutive training days
3. Branch the program based on equipment:
   - Gym: Full gym splits targeting the specific muscles needed for their sport position.
   - Court / Field: Sport-specific on-court drills and technical work.
   - Home: Bodyweight power, conditioning, and mobility.
   - Gym + Court: Alternate between gym strength days and court technical days.

RULES FOR EXERCISES:
1. Every exercise 'notes' field MUST act as a professional coaching cue (e.g., "Drive through heels, keep chest proud", "Hinge at the hips, do not round back").
2. No generic advice. Be specific, advanced, and intense.
3. If they are 'Gym' or 'Gym + Court', target the EXACT muscles needed for a ${sport} ${position || 'athlete'} to dominate.

RULES FOR NUTRITION & RECOVERY:
1. Tailor nutrition directly to their goals (${goalsText}).
2. Include at least 4 nutrition tips and 4 recovery tips.
3. Warmup and Cooldown should be highly detailed paragraphs.

Ensure the output strictly matches the JSON schema provided. Return valid JSON only, no markdown wrapping.
JSON Schema: ${JSON.stringify(RESPONSE_SCHEMA)}`;

  const userPrompt = `
Generate a weekly training schedule for this athlete:
- Sport: ${sport}
- Position: ${position || 'None'}
- Training Days: ${days}/week
- Fitness Level: ${level}
- Biometrics: ${age} years old, ${height}cm, ${weight}kg
- Goals: ${goalsText}
- Equipment Available: ${equipment}
- Injuries: ${hasInjury === 'Yes' ? injuryDetails : 'None'}
  `;

  // Try Groq first if available, then fallback to Gemini
  if (groqClient) {
    try {
      console.log("Generating workout program using Groq...");
      const completion = await groqClient.chat.completions.create({
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });

      const rawContent = completion.choices[0].message.content;
      console.log("Groq Raw Response:", rawContent);
      let data = JSON.parse(rawContent);
      
      // Groq Fix: If the AI wrapped everything in a root key like "program" or "data"
      if (!data.schedule && data.program) data = data.program;
      if (!data.schedule && data.data) data = data.data;
      if (!data.schedule && data.workout_program) data = data.workout_program;
      
      return processSchedule(data);
    } catch (groqError) {
      console.error("Groq Error:", groqError);
      if (!geminiClient) throw groqError;
      console.log("Falling back to Gemini...");
    }
  }

  // Use Gemini if Groq fails or is not available
  try {
    console.log("Generating workout program using Gemini (Fallback)...");
    const response = await geminiClient.models.generateContent({
      model: "gemini-2.0-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      }
    });

    if (!response || !response.text) {
      throw new Error("Empty response from Gemini API");
    }

    const data = JSON.parse(response.text);
    return processSchedule(data);
  } catch (geminiError) {
    console.error("Gemini API Error details:", geminiError);
    throw new Error(geminiError.message || "Failed to generate program. Please check your API keys and try again.");
  }
};

const processSchedule = (data) => {
  console.log("Normalization Input:", data);
  console.log("Data Keys:", Object.keys(data));
  
  // Normalize fields to ensure they are arrays and have sensible defaults
  const normalized = {
    schedule: Array.isArray(data.schedule) ? data.schedule : [],
    positionFocus: data.positionFocus || data.position_focus || { label: "General Athlete", muscles: [] },
    nutritionTips: Array.isArray(data.nutritionTips || data.nutrition_tips) ? (data.nutritionTips || data.nutrition_tips).map(t => typeof t === 'string' ? t : JSON.stringify(t)) : [],
    recoveryTips: Array.isArray(data.recoveryTips || data.recovery_tips) ? (data.recoveryTips || data.recovery_tips).map(t => typeof t === 'string' ? t : JSON.stringify(t)) : [],
    warmup: typeof (data.warmup || data.warm_up) === 'string' ? (data.warmup || data.warm_up) : "Dynamic mobility and activation exercises.",
    cooldown: typeof (data.cooldown || data.cool_down) === 'string' ? (data.cooldown || data.cool_down) : "Static stretching and foam rolling."
  };

  // Deep normalization of schedule
  normalized.schedule.forEach((day, index) => {
    day.day = day.day || `Day ${index + 1}`;
    day.type = (day.type === 'Rest' || day.type === 'راحه' || day.type === 'استراحة') ? 'Rest' : 'Training';
    day.focus = day.focus || "Daily training session";
    day.exercises = Array.isArray(day.exercises) ? day.exercises : [];
  });

  console.log("Final Normalized Program:", normalized);
  return normalized;
};
