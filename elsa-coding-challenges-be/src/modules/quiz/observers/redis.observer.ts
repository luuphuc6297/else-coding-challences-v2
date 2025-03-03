import { QuizEventObserver } from './quiz-event.observer'

export class RedisObserver extends QuizEventObserver {
    update(event: any): Promise<void> {
        return Promise.resolve()
    }
}
