import axios from 'axios';

import dotenv from 'dotenv';
// import SunoAI from 'suno-ai';

dotenv.config();
const { SUNO_API_KEY } = process.env;
export const generateMusic = async (req, res) => {
  try {
    const emotions = req.body.emotions;

    // 한국어로 변경 할 감정 이름 정의
    const emotionDict = {
      neutral: '중립적',
      happy: '행복',
      sad: '슬픔',
      angry: '분노',
      fearful: '두려움',
      disgusted: '혐오',
      surprised: '놀람',
    };

    // 감정 수치가 제일 높은거 추출
    const getDominantEmotion = (emotions) => {
      let maxKey = '';
      let maxValue = 0;
      for (let key in emotions) {
        if (emotions[key] > maxValue) {
          maxKey = key;
          maxValue = emotions[key];
        }
      }
      return { key: maxKey, value: maxValue };
    };
    // 제일 높은 감정을 자연어로 변경
    const getEmotionDescription = (emotionKey, emotionValue) => {
      const korEmotion = emotionDict[emotionKey];
      if (emotionValue > 0.8) {
        return `매우 ${korEmotion}한 분위기의 노래를 만들어줘`;
      } else if (emotionValue > 0.3) {
        return `${korEmotion}한 분위기의 노래를 만들어줘`;
      } else if (emotionValue > 0.1) {
        return `약간 ${korEmotion}한 분위기의 노래를 만들어줘`;
      } else {
        return '뚜렷한 주감정이 없는 중립적 상태의 노래를 만들어줘';
      }
    };

    const dominant = getDominantEmotion(emotions);
    const description = getEmotionDescription(dominant.key, dominant.value);
    console.log('🚀 ~ generateMusic ~ description:', description);

    const sunoApiUrl = 'https://api.suno.com/v1/generate-song';
    const sunoResponse = await axios.post(
      sunoApiUrl,
      {
        prompt: description,
      },
      {
        headers: {
          Authorization: `Bearer ${SUNO_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("🚀 ~ generateMusic ~ sunoResponse:", sunoResponse)

    // 자연어로 변경된거 sunoAI에게 전달해서 노래 제작
    // 제작된 노래 db에 '비공개' 상태로 새로 등록 / 관계설정 user : emotion : music

    res.json({ result: true, message: '요청 성공' });
    // 요청 할 프롬프트
    // const openAiPrompt = `
    // neutral: ${emotions.neutral}
    // happy: ${emotions.happy}
    // sad: ${emotions.emotions.sad}
    // angry: ${emotions.emotions.angry}
    // fearful: ${emotions.emotions.fearful}
    // disgusted: ${emotions.emotions.disgusted}
    // surprised: ${emotions.emotions.surprised}
    // 위 감정 데이터를 반영하여 suno ai에게 노래를 만들게 할꺼야
    // 감정들의 그 수치에 비례해 섬세하게 표현하는 창의적인 노래가사를 작성해줘.
    // 감정 이름은 가사 내용에 직접 등장하지 않게 해줘.
    // `;
    // console.log('🚀 ~ generateMusic ~ openAiPrompt:', openAiPrompt);

    // const openAiResponse = await axios.post(
    //   'https://api.openai.com/v1/chat/completions',
    //   {
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //       { role: 'system', content: 'You are a professional songwriter.' },
    //       { role: 'user', content: openAiPrompt },
    //     ],
    //     temperature: 0.8,
    //     max_tokens: 1024,
    //     top_p: 1,
    //     frequency_penalty: 0.5,
    //     presence_penalty: 0.5,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${OPENAI_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );
    // const openAiResult = openAiResponse.data.choices[0].message.content;
    // console.log('🚀 ~ generateMusic ~ openAiResult:', openAiResult);
  } catch (error) {
    console.error('OpenAI API Error:', error?.response?.data || error.message);
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
