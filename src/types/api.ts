export type EntryDecisionResponse = {
  success: boolean;
  data: {
    isQuiz: boolean;
    redirectUrl: string | null;
    quiz: QuizPayload | null;
    decisionSource: "default" | "admin_override";
    timestamp: string;
  };
};

export type QuizPayload = {
  title: string;
  questions: QuizQuestion[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type HealthResponse = {
  ok: true;
  uptimeSec: number;
  now: string;
};

export type AdminDecisionUpdateRequest = {
  isQuiz: boolean;
  redirectUrl?: string;
};
