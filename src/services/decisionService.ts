import { env } from "../config/env.js";
import { fetchQuizFromOpenTrivia } from "../clients/openTriviaClient.js";
import { HttpError } from "../middleware/errorHandler.js";
import type { EntryDecisionResponse } from "../types/api.js";
import { ensureAllowedRedirectUrl } from "../utils/url.js";
import { logger } from "../utils/logger.js";

type DecisionState = {
  isQuiz: boolean;
  redirectUrl: string;
  source: "default" | "admin_override";
};

const state: DecisionState = {
  isQuiz: env.IS_QUIZ_DEFAULT,
  redirectUrl: env.DEFAULT_REDIRECT_URL,
  source: "default"
};

export async function getEntryDecision(): Promise<EntryDecisionResponse> {
  if (state.isQuiz) {
    logger.info("decision_quiz_path", { source: state.source });
    const quiz = await fetchQuizFromOpenTrivia({
      baseUrl: env.OPEN_TRIVIA_BASE_URL,
      amount: env.OPEN_TRIVIA_AMOUNT,
      category: env.OPEN_TRIVIA_CATEGORY,
      difficulty: env.OPEN_TRIVIA_DIFFICULTY
    });

    logger.info("decision_quiz_fetched", { questionCount: quiz.questions.length });

    return {
      success: true,
      data: {
        isQuiz: true,
        redirectUrl: null,
        quiz,
        decisionSource: state.source,
        timestamp: new Date().toISOString()
      }
    };
  }

  logger.info("decision_redirect_path", { source: state.source, url: state.redirectUrl });
  const redirectUrl = ensureAllowedRedirectUrl(state.redirectUrl, env.REDIRECT_ALLOWED_HOSTS_LIST);

  return {
    success: true,
    data: {
      isQuiz: false,
      redirectUrl,
      quiz: null,
      decisionSource: state.source,
      timestamp: new Date().toISOString()
    }
  };
}

export function updateDecision(input: { isQuiz: boolean; redirectUrl?: string }): DecisionState {
  if (!input.isQuiz) {
    if (!input.redirectUrl) {
      throw new HttpError(400, "redirectUrl is required when isQuiz is false");
    }

    state.redirectUrl = ensureAllowedRedirectUrl(input.redirectUrl, env.REDIRECT_ALLOWED_HOSTS_LIST);
  }

  state.isQuiz = input.isQuiz;
  state.source = "admin_override";

  return { ...state };
}

export function getCurrentDecisionState(): DecisionState {
  return { ...state };
}
