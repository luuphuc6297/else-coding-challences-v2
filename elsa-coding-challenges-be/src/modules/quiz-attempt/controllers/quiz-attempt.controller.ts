import {Controller} from '@nestjs/common'
import {QuizAttemptService} from '../services/quiz-attempt.service'

@Controller()
export class QuizAttemptController {
  constructor(private readonly quizAttemptService: QuizAttemptService) {}
}
