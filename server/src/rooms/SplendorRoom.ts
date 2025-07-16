import { Room, Client } from "colyseus";

export class SplendorRoom extends Room {
    onCreate(options: any) {
        console.log("✅ SplendorRoom 생성됨");
    }

    onJoin(client: Client, options: any) {
        console.log(`👤 클라이언트 ${client.sessionId}가 입장했습니다.`);
    }

    onLeave(client: Client, consented: boolean) {
        console.log(`👋 ${client.sessionId}가 방을 떠났습니다.`);
    }

    onDispose() {
        console.log("🧹 SplendorRoom 삭제됨");
    }
}
