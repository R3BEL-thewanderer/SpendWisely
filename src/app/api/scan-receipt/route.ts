import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { base64Data, mimeType } = await req.json();

    if (!base64Data) {
      return NextResponse.json({ error: 'Missing base64Data' }, { status: 400 });
    }

    const apiKey =
      process.env.NVIDIA_API_KEY ||
      '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';
    const model =
      process.env.NVIDIA_PRO_MODEL ||
      process.env.NVIDIA_CHAT_MODEL ||
      'meta/llama-3.2-11b-vision-instruct';

    const prompt = `Analyze this receipt, bill, or payment screenshot. Extract and return JSON ONLY with no markdown, backticks, or extra explanation:
{
  "merchantName": "Store or merchant name",
  "amount": Total numeric amount (e.g. 450.00),
  "date": "YYYY-MM-DD",
  "category": "Food & Dining" | "Shopping" | "Transportation" | "Bills & Utilities" | "Entertainment" | "Health" | "Other",
  "paymentMethod": "UPI" | "Credit Card" | "Debit Card" | "Cash",
  "items": [{"name": "item name", "price": 100.0}],
  "notes": "Short summary"
}`;

    const imageUrl = `data:${mimeType || 'image/jpeg'};base64,${base64Data}`;

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
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: imageUrl } },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 512,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn('NVIDIA Vision OCR API error:', response.status, errText);
      return NextResponse.json({ error: 'Vision API failed' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Clean JSON markdown blocks if any
    const cleaned = content
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (err: any) {
    console.error('Scan receipt route error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to parse image' },
      { status: 500 }
    );
  }
}
