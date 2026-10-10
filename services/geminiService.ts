import { GoogleGenAI, Chat } from "@google/genai";

const STORAGE_KEY = "aura_gemini_api_key";

export function getStoredApiKey(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored.trim().length > 0) return stored.trim();
  }
  // Try Vite environment or process.env if available
  const envKey = (typeof process !== "undefined" && process.env?.API_KEY) || 
                 (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) ||
                 "";
  return envKey;
}

export function saveApiKey(key: string): void {
  if (typeof window !== "undefined") {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    // Reset active chat so new key takes effect
    chatInstance = null;
    aiInstance = null;
  }
}

export function isApiKeyConfigured(): boolean {
  const key = getStoredApiKey();
  return Boolean(key && key.length > 5);
}

const systemInstruction = `You are 'Aura', a deeply compassionate, calm, and supportive mental health companion built with Cupertino Apple-grade design philosophy: clarity, deference, and empathetic depth.

Core Functionality:
1. Stress Management: If a user asks for help with stress, anxiety, or relaxation, guide them gently. Offer 'Deep Breathing' (4-7-8 or Box breathing), '5-4-3-2-1 Grounding', or 'Progressive Muscle Relaxation'. Deliver exercises step-by-step with warm, concise encouragement.
2. Emotional Reflection & CBT Reframing: Listen actively, validate their emotions without judgment, and gently offer constructive perspectives to reframe cognitive distortions.
3. Mood & Journaling: Celebrate small wins, encourage mindfulness reflection, and suggest journaling prompts.
4. Tone & Style: Warm, serene, grounding, concise. Avoid robotic cliches. Use well-spaced formatting with gentle bullet points where helpful.

CRITICAL SAFETY PROTOCOL:
You are an AI wellness companion, not a licensed healthcare provider. If the user expresses self-harm, suicidal ideation, severe acute distress, or immediate danger:
Respond immediately with compassion and prioritize their safety:
"It sounds like you are going through an overwhelming time, and your life and safety matter deeply. Please reach out to someone who can support you right now. You are not alone:
• US & Canada: Call or text 988 (Lifeline)
• UK: Call 111 or text SHOUT to 85258
• Crisis Text Line: Text HOME to 741741
• India: Tele-MANAS at 14416 or 1800-891-4416
• International: Find your local support at findahelpline.com
Please consider speaking to a healthcare professional or trusted loved one right now."`;

let aiInstance: GoogleGenAI | null = null;
let chatInstance: Chat | null = null;

function getChatClient(): Chat | null {
  const apiKey = getStoredApiKey();
  if (!apiKey) return null;

  try {
    if (!aiInstance) {
      aiInstance = new GoogleGenAI({ apiKey });
    }
    if (!chatInstance) {
      chatInstance = aiInstance.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
        },
      });
    }
    return chatInstance;
  } catch (err) {
    console.warn("Could not initialize GoogleGenAI client:", err);
    return null;
  }
}

/**
 * Intelligent local empathetic companion engine for offline/demo use
 * or when Gemini API key is not configured.
 */
function getOfflineEmpatheticResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  // Safety trigger
  if (
    lower.includes("suicide") ||
    lower.includes("kill myself") ||
    lower.includes("end my life") ||
    lower.includes("hurt myself") ||
    lower.includes("self harm") ||
    lower.includes("want to die")
  ) {
    return `I hear how much pain you're in, and I want you to know you are not alone. Please reach out to professional support right away—there are caring people ready to listen:

• National Suicide & Crisis Lifeline: Call or text 988 (24/7, free, confidential)
• Crisis Text Line: Text HOME to 741741
• UK Crisis Line: Call 111 or text SHOUT to 85258
• India Tele-MANAS: Call 14416
• International: Visit https://findahelpline.com

Please connect with one of these resources or reach out to someone you trust. Your safety matters.`;
  }

  // Breathing & relaxation
  if (lower.includes("breathe") || lower.includes("breathing") || lower.includes("breath")) {
    return `Let's take a peaceful moment together. 🌿

Try this calming 4-4-4-4 Box Breathing exercise:
1. Inhale slowly through your nose for 4 seconds... feel your abdomen expand.
2. Hold that breath gently for 4 seconds.
3. Exhale smoothly through your mouth for 4 seconds.
4. Rest empty for 4 seconds before the next breath.

You can also tap the "Guided Breathing" button at the top of the screen to open Aura's interactive Apple Breathe visualizer. How does your body feel right now?`;
  }

  // Anxiety & panic
  if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("panic") || lower.includes("overwhelm")) {
    return `It is completely valid to feel this way. Anxiety can feel overwhelming in the body, but remember: this feeling is temporary and you are safe in this present moment.

Let's ground your senses with the 5-4-3-2-1 technique:
• 5 things you can see around you right now
• 4 things you can physically touch (the texture of your desk, your clothes)
• 3 things you can hear
• 2 things you can smell
• 1 thing you can taste or feel grateful for

Take a slow breath. What is one thing right in front of you that catches your eye?`;
  }

  // Sadness & feeling down
  if (lower.includes("sad") || lower.includes("depressed") || lower.includes("unhappy") || lower.includes("crying") || lower.includes("lonely")) {
    return `I'm really sorry you're carrying this heavy feeling today. It takes courage to acknowledge it, and it's okay to not be okay right now. 💙

Give yourself permission to rest. You don't have to fix everything in this exact minute. 

Would you like to write out what triggered this feeling, try a soothing ambient soundscape from the sidebar, or would you simply like me to listen? I'm here with you.`;
  }

  // Stress & burnout
  if (lower.includes("stress") || lower.includes("burnout") || lower.includes("tired") || lower.includes("exhausted") || lower.includes("work")) {
    return `Burnout and stress are your mind and body signaling that you've been carrying too much for too long. 

A gentle reminder:
• Rest is not something you have to earn; it is essential.
• Focus on just the next small step, rather than the entire mountain.
• Step away from screens for 5 minutes, stretch your shoulders, and drink a sip of water.

What is one expectation you could gently let go of or postpone for today?`;
  }

  // Sleep & bedtime
  if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("can't sleep") || lower.includes("bedtime")) {
    return `Restful sleep begins with calming our nervous system. 🌙

Here are three gentle tips to unwind tonight:
1. Turn on the Ocean Waves or Rain sounds in the sidebar to create a serene auditory environment.
2. Unclench your jaw, drop your shoulders away from your ears, and soften your brow.
3. Try a 4-7-8 breathing cycle: Inhale for 4s, hold for 7s, long gentle exhale for 8s.

Let your thoughts drift like clouds passing across an evening sky.`;
  }

  // Journaling & gratitude
  if (lower.includes("journal") || lower.includes("gratitude") || lower.includes("write")) {
    return `Journaling is such a powerful tool for emotional clarity. ✨

Here is a mindful reflection prompt for you:
"What is one quiet kindness someone showed you recently, or one simple comfort in your day that you often take for granted?"

Take your time to write down whatever comes up without editing yourself.`;
  }

  // Default warm companion response
  return `Thank you for sharing that with me. Every emotion you experience has a voice, and taking space to reflect on it is a meaningful act of self-care.

Would you like to explore this a little deeper, try a brief grounding exercise, or listen to one of our calming ambient soundscapes? I'm right here with you.`;
}

/**
 * Sends a message and yields streaming chunks.
 * Handles both Google Gemini 2.5 Flash API and smart offline empathetic mode.
 */
export async function* sendMessageStream(message: string): AsyncGenerator<{ text: string }> {
  const chat = getChatClient();

  if (chat) {
    try {
      const stream = await chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        if (chunk.text) {
          yield { text: chunk.text };
        }
      }
      return;
    } catch (err: any) {
      console.warn("Gemini API error, falling back to local companion engine:", err);
      // Fall through to offline response
    }
  }

  // Offline / Demo empathetic streaming simulation
  const responseText = getOfflineEmpatheticResponse(message);
  const words = responseText.split(" ");
  for (let i = 0; i < words.length; i += 3) {
    const chunk = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
    await new Promise((res) => setTimeout(res, 28)); // realistic Apple-grade streaming pace
    yield { text: chunk };
  }
}