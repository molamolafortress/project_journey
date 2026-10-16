import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { estimateRealisticBucketItem, checkNeedsRefinement, generateArgonProfile } from './src/game/engine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with server-side API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * 1. POST /api/gemini/analyze
 * Infers realistic cost, duration, lifespan bonus, story narrative, and chronicle using Gemini Flash.
 */
app.post('/api/gemini/analyze', async (req: Request, res: Response) => {
  const { text, id } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  const itemId = Number(id) || 1;
  const fallback = estimateRealisticBucketItem(text, itemId);

  if (!process.env.GEMINI_API_KEY) {
    return res.json(fallback);
  }

  try {
    const prompt = `당신은 시한부 6개월 인생 게임의 '스토리텔러이자 현실 분석관'입니다.
플레이어의 버킷리스트 항목: "${text.trim()}"

[소망 해석 및 비용 산정 핵심 지침]
1. 비현실적/초자연적/극단적/금지된 소망에 대한 '우회적 실현 (Detour & Experiential Realization)':
   - 사용자가 비현실적이거나 초자연적이거나 물리적/법적으로 불가능한 소망(예: '핵미사일 구매/발사', '전지전능', '엘사 초능력 갖기', '시간 여행', '신이 되기', '우주 정복' 등)을 입력하더라도, 차갑게 "불가능합니다/수천억 원입니다"라고 거절하거나 거액의 불가능 처리를 하지 마십시오.
   - 대신, 시한부 주인공이 현실에서 그 소망의 본질과 심리적 갈망을 경험할 수 있는 '예술적·체험적·심리적 우회 프로젝트'로 재해석하여 실현하십시오!
     * 예시 1 ('전지전능'): 전문 수면 클리닉의 자각몽(루시드 드림) 훈련을 받아, 매일 밤 꿈속에서 물리 법칙을 초월해 세상을 창조하는 전지전능을 만끽함 (비용: 약 $2,500, 소요 14일)
     * 예시 2 ('엘사 초능력'): 북유럽 또는 홋카이도 얼음 호텔과 특수효과 스튜디오를 대관해 액체질소/특수 드라이아이스와 조명 연출로 손끝에서 얼음 결정을 피워내는 마법 같은 순간을 연출하며 동심을 되찾음 (비용: 약 $4,500, 소요 10일)
     * 예시 3 ('핵미사일 구매/발사'): 사막의 로켓 발사대 관측 및 퇴역 핵사일로 벙커 투어, 대형 폭발/불꽃 특수효과 시뮬레이션 체험을 대관하여 굉음과 지축을 울리는 진동 속에서 억눌렸던 분노와 허무를 날려보냄 (비용: 약 $6,000, 소요 10일)
     * 예시 4 ('시간 여행'): 어린 시절 살던 옛 동네와 레트로 세트장을 찾아가고 낡은 일기와 옛 사진들을 재현하는 추억 시간여행 프로젝트 (비용: 약 $1,500, 소요 7일)
   - 이 경우 비용은 주인공의 6개월 총 예산($100,000) 내에서 지출 가능한 현실적인 우회 비용($1,000 ~ $15,000)으로 산정합니다.

2. 일반 현실적 소망의 엄밀한 현실 물가 반영:
   - 미국 여행(14일): $5,000 ~ $7,500 (국적기 왕복 항공 $1,500 + 호텔 13박 $2,500 + 현지 식비/교통/입장료 $2,000)
   - 유럽 여행(14일): $4,500 ~ $6,500
   - 홈파티 / 만찬: $1,200 ~ $2,500
   - 가족/친구 식사 및 화해: $200 ~ $600
   - 독립출판 에세이 출간: $3,500 ~ $5,000 (교정, 표지 디자인, 300부 인쇄)
   - 어쿠스틱 음원 발매: $2,500 ~ $4,000
   - 시골집 렌트 및 요양: $8,000 ~ $15,000

3. 한자 사용 절대 금지:
   - 본문, 제목, 설명, 산정 근거 등 어떤 필드에서도 한자(Chinese characters)는 절대 쓰지 마세요. 순수하고 명확한 한글로만 작성하세요.

4. 필드 구성:
   - cost (USD 숫자): 우회 체험 또는 실제 소망의 현실 비용
   - costBreakdown (문자열): 구체적 항목별 금액 합산 식 (예: "사막 로켓 관측 투어 $2,500 + 핵사일로 투어 $1,500 + 대형 폭발 시뮬레이션 및 체류비 $2,000 = 총 $6,000")
   - rationale (문자열): 왜 이 우회 체험/방식으로 재해석했는지, 어떤 세부 비용이 들어갔는지에 대한 친절하고 따뜻한 현실적 근거 (2~3문장)
   - feasibility: "realistic" (현실적 실현 가능)
   - daysSpent (숫자): 실행에 들어간 현실적 일수 (보통 3 ~ 21일)
   - lifespanDelta (숫자): 소망을 마주하고 이뤘을 때 얻는 삶의 온기 (0.8 ~ 2.4개월)
   - story (문자열): 주인공이 그 경험을 하며 느낀 깊은 감정의 여정을 묘사하는 2문단 (각 문단은 \\n\\n으로 구분)
   - chronicle (문자열): 엔딩에 기록될 묵직하고 여운을 남기는 회고 2문장

반드시 마크다운 없이 아래 순수 JSON 형식으로만 응답하세요:
{
  "cost": number,
  "costBreakdown": string,
  "rationale": string,
  "feasibility": "realistic" | "high_cost" | "extreme",
  "daysSpent": number,
  "lifespanDelta": number,
  "story": string,
  "chronicle": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text?.trim();
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return res.json({
        id: itemId,
        text: text.trim(),
        cost: Number(parsed.cost) || fallback.cost,
        costBreakdown: parsed.costBreakdown || fallback.costBreakdown,
        rationale: parsed.rationale || fallback.rationale,
        feasibility: parsed.feasibility || fallback.feasibility || 'realistic',
        daysSpent: Number(parsed.daysSpent) || fallback.daysSpent,
        lifespanDelta: Number(parsed.lifespanDelta) || fallback.lifespanDelta,
        story: parsed.story || fallback.story,
        chronicle: parsed.chronicle || fallback.chronicle,
        status: 'ready',
        selected: false,
      });
    }

    return res.json(fallback);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Gemini analyze error, using realistic fallback:', errorMsg);
    return res.json(fallback);
  }
});

/**
 * 2. POST /api/gemini/refine
 * Uses Gemini Flash to provide 3 concrete suggestions if the user entered a vague single word.
 */
app.post('/api/gemini/refine', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  const fallback = checkNeedsRefinement(text);

  if (!process.env.GEMINI_API_KEY) {
    return res.json(fallback || { question: `'${text}'을 구체화해볼까요?`, options: [`${text} 구체화 1`, `${text} 구체화 2`, `${text} 구체화 3`] });
  }

  try {
    const prompt = `사용자가 버킷리스트로 짧고 모호하게 "${text.trim()}"라고만 입력했습니다.
이 소망을 조금 더 구체적인 컨셉으로 다듬을 수 있는 다정한 질문 1개와, 구체화된 선택지 3개를 추천하세요.
반드시 마크다운 없이 순수 JSON으로 응답하세요:
{
  "question": "질문 내용",
  "options": ["구체적 선택지 1", "구체적 선택지 2", "구체적 선택지 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text?.trim();
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return res.json(parsed);
    }
    return res.json(fallback);
  } catch {
    return res.json(fallback);
  }
});

/**
 * 3. POST /api/gemini/profile
 * Background "Argon" profiling agent deriving the player's Genuine Self (coreValue, summary, repressedDesires).
 */
app.post('/api/gemini/profile', async (req: Request, res: Response) => {
  const { items } = req.body;
  const itemsList: string[] = Array.isArray(items) ? items : [];

  const fallback = generateArgonProfile(
    itemsList.map((t, idx) => estimateRealisticBucketItem(t, idx + 1))
  );

  if (!process.env.GEMINI_API_KEY || itemsList.length === 0) {
    return res.json(fallback);
  }

  try {
    const prompt = `당신은 심리 분석 에이전트 'Argon'입니다.
플레이어가 6개월 시한부를 앞두고 작성한 10가지 버킷리스트:
[${itemsList.join(' / ')}]

이 사람이 현실에서 무엇을 억누르고 살아왔는지, 마음 깊은 곳에서 갈망하는 진정한 자아(Genuine Self)의 핵심 가치가 무엇인지 분석하세요.
반드시 마크다운 없이 순수 JSON으로만 응답하세요:
{
  "coreValue": "한 줄 핵심 가치 (예: 나만의 호흡으로 살아가는 삶과 진실한 관계)",
  "summary": "3문장 분량의 깊이 있고 따뜻한 내면 심리 분석글",
  "repressedDesires": "현실의 바쁨과 타인의 시선 때문에 억눌려 있던 소망들에 대한 분석"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text?.trim();
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return res.json({
        status: 'ready',
        coreValue: parsed.coreValue || fallback.coreValue,
        summary: parsed.summary || fallback.summary,
        repressedDesires: parsed.repressedDesires || fallback.repressedDesires,
      });
    }
    return res.json(fallback);
  } catch (err: unknown) {
    console.error('Gemini profile error, using fallback:', err);
    return res.json(fallback);
  }
});

/**
 * 4. POST /api/gemini/generate-artwork
 * Generates an individualized commemorative artwork based on the player's profile and chosen journey.
 * Uses gemini-3.1-flash-lite-image.
 */
app.post('/api/gemini/generate-artwork', async (req: Request, res: Response) => {
  const { coreValue, summary, history, theme } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: 'API key not configured' });
  }

  try {
    const historyText = Array.isArray(history)
      ? history.map((h: { text?: string }) => h.text || '').filter(Boolean).join(', ')
      : '';

    // Step 1: Craft artistic concept prompt in English
    const conceptPrompt = `당신은 시한부 6개월 게임의 예술 감독입니다.
플레이어의 진정한 내면 핵심 가치: "${coreValue || '나만의 온전한 호흡으로 살아가는 삶'}"
내면 분석 요약: "${summary || '세상의 잣대를 벗어나 온전한 평온을 찾음'}"
플레이어가 선택한 소망들: [${historyText || '소중한 인연들과의 따뜻한 식탁, 나만의 작은 책 출판, 밤하늘 오로라'}]
스타일 톤: ${theme === 'black' ? 'Dark cinematic fantasy, deep cosmos, serene glowing light' : 'Warm atmospheric watercolor and modern Korean aesthetic, golden hour sunlight, peaceful landscape'}

이 사람의 영혼과 여정을 기리는 단 하나의 헌정 명화를 제작하기 위한 고품질 영문 이미지 생성 프롬프트(1문장)를 작성하세요.
절대 인물이 고통받거나 아파 보이지 않게 하고, 따뜻한 평온, 경이로운 자연, 빛, 진정한 자유가 느껴지도록 묘사하세요.
한자나 마크다운 없이 오직 영문 프롬프트 1문장만 출력하세요:`;

    const promptRes = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: conceptPrompt,
    });

    const imagePrompt = promptRes.text?.trim() ||
      'A breathtaking serene artwork of a solitary traveler on a peaceful hill under warm golden morning light and ethereal starlight, watercolor and concept art aesthetic, 8k masterpiece';

    // Step 2: Generate image with gemini-3.1-flash-lite-image
    const imageRes = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: imagePrompt,
      config: {
        imageConfig: {
          aspectRatio: '16:9',
        },
      },
    });

    const candidate = imageRes.candidates?.[0];
    const parts = candidate?.content?.parts;
    let base64Data = '';
    let mimeType = 'image/jpeg';

    for (const part of parts || []) {
      if (part.inlineData && part.inlineData.data) {
        base64Data = part.inlineData.data;
        mimeType = part.inlineData.mimeType || 'image/jpeg';
        break;
      }
    }

    if (base64Data) {
      return res.json({
        imageUrl: `data:${mimeType};base64,${base64Data}`,
        prompt: imagePrompt,
      });
    }

    return res.status(500).json({ error: 'Failed to extract generated image' });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Artwork generation error:', errorMsg);
    return res.status(500).json({ error: errorMsg });
  }
});

// Mount Vite middleware in development, or serve dist in production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`[Server] Running on http://localhost:${port} (Gemini Flash & Argon Integration active)`);
});
