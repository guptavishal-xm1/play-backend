import { HttpError } from "../middleware/errorHandler.js";
import type { QuizPayload, QuizQuestion } from "../types/api.js";

type OpenTriviaApiResponse = {
  response_code: number;
  results: Array<{
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }>;
};

function decodeHtml(input: string): string {
  return input
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function fetchQuizFromOpenTrivia(input: {
  baseUrl: string;
  amount: number;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
}): Promise<QuizPayload> {
  const params = new URLSearchParams({
    amount: String(input.amount),
    type: "multiple"
  });

  if (input.category) {
    params.set("category", input.category);
  }

  if (input.difficulty) {
    params.set("difficulty", input.difficulty);
  }

  const endpoint = `${input.baseUrl}/api.php?${params.toString()}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new HttpError(502, "Open Trivia API request failed");
  }

  const payload = (await response.json()) as OpenTriviaApiResponse;

  if (payload.response_code !== 0 || !Array.isArray(payload.results) || payload.results.length === 0) {
    throw new HttpError(502, "Open Trivia API returned no questions");
  }

  const questions: QuizQuestion[] = payload.results.map((entry, index) => {
    const question = decodeHtml(entry.question);
    const correctAnswer = decodeHtml(entry.correct_answer);
    const options = shuffle([correctAnswer, ...entry.incorrect_answers.map(decodeHtml)]);

    return {
      id: `${Date.now()}-${index + 1}`,
      question,
      options,
      correctAnswer
    };
  });

  return {
    title: "Daily Challenge Quiz",
    questions
  };
}
