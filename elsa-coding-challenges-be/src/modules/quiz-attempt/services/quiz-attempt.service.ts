import {Injectable} from '@nestjs/common'
import {QuizAttemptRepository} from '../repository/repositories/quiz-attempt.repository'

@Injectable()
export class QuizAttemptService {
  constructor(private readonly quizAttemptRepository: QuizAttemptRepository) {}
}
