// Google GenAI Dependency Removed for Vercel Deployment Stability

export const generateExplanation = async (
  target: string,
  feature: string,
  stats: string
): Promise<string> => {
  // Mock response to simulate API behavior without actual call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("현재 데모 버전에서는 AI 설명 기능이 비활성화되어 있습니다. (API 연동 해제됨)");
    }, 1000);
  });
};