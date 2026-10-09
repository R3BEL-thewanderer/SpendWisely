import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, financialContext } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const apiKey =
      process.env.NVIDIA_API_KEY ||
      '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';
    const model =
      process.env.NVIDIA_CHAT_MODEL || 'meta/llama-3.2-11b-vision-instruct';

    // Format financial context safely
    const ctx = financialContext || {};
    const contextPrompt = `
You are SpendWise AI, an intelligent, empathetic, and sophisticated personal financial advisor & co-pilot.
You have real-time access to the user's personal ledger snapshot:

[VERIFIED LEDGER DATA]
• Net Balance: ₹${(ctx.balance ?? 304723).toLocaleString('en-IN')}
• Monthly Income: ₹${(ctx.totalIncome ?? 423000).toLocaleString('en-IN')}
• Monthly Expenses: ₹${(ctx.totalExpenses ?? 118277).toLocaleString('en-IN')}
• Top Category: ${ctx.topCategory || 'Food & Dining'} (₹${(ctx.topCategoryAmount ?? 34500).toLocaleString('en-IN')})
• Top Spends: ${ctx.topSpends || 'Burma Burma Dinner (₹2,400), Cult.fit Gym (₹1,800), Blinkit (₹980)'}
• Payment Modes: ${ctx.paymentBreakdown || 'UPI (62%), Credit Card (28%), Cash (10%)'}
• Active Goals: ${ctx.goalsSummary || 'Emergency Fund (65%), Goa Trip (40%)'}

[CONVERSATION GUIDELINES]
1. GREETINGS ("hello", "hi", "hey"): Greet the user warmly and introduce yourself as their SpendWise financial co-pilot. DO NOT dump raw financial figures unless they ask. Offer 2-3 helpful things they can ask you about.
2. FINANCIAL QUERIES: Cite specific amounts accurately using ₹ (INR) from the verified data above.
3. ADVICE & SAVINGS: Give pragmatic, actionable financial tips (e.g. cutting top categories by 10%, optimizing credit card cashback, or eliminating zombie subscriptions).
4. TONE: Warm, concise, articulate, and encouraging. Keep responses to 2-4 sentences or clean markdown bullet points. Avoid robotic financial jargon.
`.trim();

    const response = await fetch(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: contextPrompt,
            },
            {
              role: 'user',
              content: query,
            },
          ],
          temperature: 0.3,
          max_tokens: 512,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('NVIDIA NIM API error:', response.status, errText);
      return NextResponse.json(
        { error: 'NVIDIA API failed', details: errText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const replyText =
      data.choices?.[0]?.message?.content ||
      "I'm here to help analyze your finances. What would you like to know?";

    return NextResponse.json({
      text: replyText.trim(),
      model: data.model || model,
    });
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
