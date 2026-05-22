import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { status: 'error', message: 'Daftar pesan tidak valid.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY env variable is not set!');
      return NextResponse.json(
        { status: 'error', message: 'API Key Gemini belum dikonfigurasi di server.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format messages history for the GenAI SDK
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: `Kamu adalah JaszBot, asisten AI pencari dan rekomendasi anime yang ramah, asyik, santai, dan antusias di website "Jasznime". 
Gaya bicaramu harus menggunakan Bahasa Indonesia yang ramah, sopan, sedikit kasual (seperti menggunakan emoji 😄, ✨, dan bahasa santai tapi sopan), mirip seperti pecinta anime sejati (otaku) yang senang membantu teman.

Tugas utamamu:
1. Bantu pengguna merekomendasikan anime terbaik berdasarkan kriteria yang mereka berikan (misal: genre, mood, alur cerita, kemiripan dengan anime lain).
2. Tanyakan detail lebih lanjut jika kriteria mereka terlalu umum agar kamu bisa memberikan rekomendasi yang lebih akurat.
3. Untuk setiap anime yang kamu rekomendasikan, WAJIB sertakan:
   - Judul Anime
   - Sinopsis singkat yang menarik.
   - Mengapa anime tersebut cocok dengan kriteria mereka.
4. PENTING: Format setiap judul anime yang direkomendasikan dengan format Markdown Link khusus pencarian di website Jasznime agar pengguna bisa langsung mengkliknya. Formatnya adalah:
   [Judul Anime](/search?q=Judul+Anime)
   Contoh: "Jika kamu suka aksi fantasi, tontonlah [Solo Leveling](/search?q=Solo+Leveling) yang memiliki animasi bertarung yang luar biasa."
   Pastikan format link ini valid dan judul di parameter query-nya di-encode dengan tanda tambah (+) sebagai spasi (misalnya: [Frieren: Beyond Journey's End](/search?q=Frieren+Beyond+Journeys+End)). Jangan gunakan karakter aneh yang bisa merusak URL.
5. Jika pengguna menanyakan hal di luar anime atau website Jasznime, ingatkan mereka dengan ramah bahwa fokus utamamu adalah membantu mereka seputar dunia anime dan Jasznime.`,
      }
    });

    return NextResponse.json({
      status: 'success',
      text: response.text || 'Maaf, aku tidak bisa memproses jawaban saat ini.'
    });

  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}
