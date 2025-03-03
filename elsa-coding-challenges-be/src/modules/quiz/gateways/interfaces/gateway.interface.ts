import { Socket } from 'socket.io'

export interface IQuizGateway {
    handleParticipantReady(client: Socket, payload: any): Promise<any>
    handleSubmitAnswer(client: Socket, payload: any): Promise<any>
    handleReconnect(client: Socket, payload: any): Promise<any>
}
