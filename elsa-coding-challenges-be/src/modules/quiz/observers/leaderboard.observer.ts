import { QuizEventObserver } from './quiz-event.observer'

export class LeaderboardObserver extends QuizEventObserver {
    update(event: any): Promise<void> {
        return Promise.resolve()
    }
}
