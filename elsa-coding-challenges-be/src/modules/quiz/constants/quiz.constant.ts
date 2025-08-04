export const QUIZ_EVENTS = {
  PARTICIPANT_JOINED: 'quiz.participant.joined',
  PARTICIPANT_READY: 'quiz.participant.ready',
  QUIZ_STARTED: 'quiz.started',
  QUESTION_STARTED: 'quiz.question.started',
  ANSWER_SUBMITTED: 'quiz.answer.submitted',
  QUIZ_COMPLETED: 'quiz.completed',
  LEADERBOARD_UPDATED: 'quiz.leaderboard.updated',
  PARTICIPANT_DISCONNECTED: 'quiz.participant.disconnected',
  PARTICIPANT_RECONNECTED: 'quiz.participant.reconnected',
}

export const QUIZ_CHANNELS = {
  SESSION: 'quiz:session:',
  LEADERBOARD: 'quiz:leaderboard:',
  GLOBAL: 'quiz:global',
}

export const QUIZ_SCORING = {
  TIME_BONUS_MULTIPLIER: 0.5,
  BASE_POINTS_CORRECT: 100,
  PENALTY_WRONG_ANSWER: -25,
  MAX_TIME_BONUS: 50,
}

export const QUIZ_TIMEOUTS = {
  DEFAULT_QUESTION_TIME: 30000,
  JOIN_TIMEOUT: 60000,
  RECONNECT_TIMEOUT: 30000,
  SUBMIT_GRACE_PERIOD: 2000,
}

export const QUIZ_LIMITS = {
  MAX_PARTICIPANTS: 100,
  MIN_PARTICIPANTS: 1,
  MAX_QUESTIONS_PER_QUIZ: 50,
  MAX_RECONNECT_ATTEMPTS: 3,
}
