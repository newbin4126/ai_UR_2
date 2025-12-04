import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In Vercel, make sure to add API_KEY in Settings > Environment Variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExplanation = async (
  target: string,
  feature: string,
  stats: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API 키가 설정되지 않았습니다. Vercel 환경 변수에서 API_KEY를 설정해주세요.";
  }

  try {
    const prompt = `
      역할: 당신은 친절하고 유머러스한 데이터 통역사입니다.
      상황: 사용자는 의료 데이터 분석 결과를 보고 있습니다.
      
      할 일:
      다음 통계 데이터를 바탕으로 비전공자도 100% 이해할 수 있게 쉬운 말로 설명해주세요.
      
      규칙:
      1. '고객님'이라는 호칭은 절대 쓰지 마세요.
      2. 딱딱한 전문 용어 대신 일상적인 비유를 들어주세요. (예: "세포의 크기가 클수록 위험해요" -> "마치 풍선이 너무 커지면 터지기 쉬운 것처럼...")
      3. 말투는 "~해요", "~인 것 같아요" 처럼 부드럽고 대화하듯 작성하세요.
      4. 3문장 내외로 짧고 핵심만 말해주세요.
      5. 정보의 정확성은 유지해야 합니다.

      분석 데이터:
      ${stats}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "AI 분석 결과를 가져올 수 없어요. 잠시 후 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "지금은 AI 친구가 조금 바쁜 것 같아요! (API 오류 발생)";
  }
};