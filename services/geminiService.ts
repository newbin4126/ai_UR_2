import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API Client
// Note: API_KEY must be set in your environment variables (e.g., Vercel Project Settings)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExplanation = async (
  target: string,
  feature: string,
  stats: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        당신은 복잡한 의료 데이터를 일반인도 이해하기 쉽고 재미있게 설명해주는 '데이터 통역사'입니다.

        [분석 데이터]
        - 타겟 변수(알고 싶은 결과): ${target}
        - 특징 변수(원인/요인): ${feature}
        - 통계 요약: ${stats}

        [요청 사항]
        위 통계를 바탕으로 ${feature} 데이터가 ${target}에 어떤 영향을 주는지, 혹은 이 데이터가 어떤 의미를 갖는지 쉽고 명쾌하게 설명해주세요.

        [제약 사항]
        1. '고객님'이라는 호칭은 절대 사용하지 마세요. 대신 친구에게 말하듯 친근한 말투(예: "~해요", "~그렇답니다")를 사용하세요.
        2. 전문 용어는 피하고, 일상적인 비유(예: 자동차, 날씨 등)를 사용하여 재미있게 설명하세요.
        3. 재미있게 설명하되, 통계적 수치에 근거하여 정보의 정확성은 반드시 지키세요.
        4. 3문장 이내로 요점만 간결하게 작성하세요.
      `,
    });

    return response.text || "분석 결과를 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 AI 분석 서비스를 이용할 수 없습니다. (API 키를 확인하거나 잠시 후 다시 시도해주세요)";
  }
};