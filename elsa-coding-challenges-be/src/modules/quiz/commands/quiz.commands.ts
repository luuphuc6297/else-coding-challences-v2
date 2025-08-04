import {IQuizParticipant, ISubmittedAnswer} from '../interfaces/quiz.interface'

export class JoinQuizCommand {
  constructor(
    public readonly quizId: string,
    public readonly participant: IQuizParticipant,
    public readonly socketId: string
  ) {}
}

export class StartQuestionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly questionIndex: number,
    public readonly questionId: string,
    public readonly timeLimit: number
  ) {}
}

export class StartQuizSessionCommand {
  constructor(
    public readonly quizId: string,
    public readonly sessionId: string,
    public readonly participantIds: string[]
  ) {}
}

export class SubmitAnswerCommand {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly submittedAnswer: ISubmittedAnswer
  ) {}
}

export class UpdateLeaderboardCommand {
  constructor(
    public readonly quizId: string,
    public readonly userId: string,
    public readonly score: number,
    public readonly timeSpent: number,
    public readonly isCorrect: boolean
  ) {}
}
