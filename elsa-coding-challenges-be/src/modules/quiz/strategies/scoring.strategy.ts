export interface IScoringStrategy {
    calculatePoints(timeSpent: number, timeLimit: number, basePoints: number): number
}

export class TimeBasedScoringStrategy implements IScoringStrategy {
    calculatePoints(timeSpent: number, timeLimit: number, basePoints: number): number {
        return 0
    }
}
