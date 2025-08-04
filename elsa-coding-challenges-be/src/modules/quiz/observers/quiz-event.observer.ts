export abstract class QuizEventObserver {
  abstract update(event: any): Promise<void>
}

export class QuizEventSubject {}
