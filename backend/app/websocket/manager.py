import json
import asyncio
import logging
from datetime import datetime, timezone
from fastapi import WebSocket, WebSocketDisconnect
from app.core.redis import redis_manager

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self._connections: dict[str, dict[str, WebSocket]] = {}
        self._user_rooms: dict[str, set[str]] = {}

    async def connect(self, websocket: WebSocket, client_id: str, rooms: list[str] | None = None):
        await websocket.accept()
        if "global" not in self._connections:
            self._connections["global"] = {}
        self._connections["global"][client_id] = websocket
        self._user_rooms[client_id] = {"global"}

        if rooms:
            for room in rooms:
                await self.join_room(client_id, room, websocket)

        logger.info(f"Client {client_id} connected. Total: {self.active_count}")

        await self._send_to_client(websocket, {
            "type": "connection_established",
            "client_id": client_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })

    async def disconnect(self, client_id: str):
        rooms = self._user_rooms.pop(client_id, set())
        for room in rooms:
            if room in self._connections:
                self._connections[room].pop(client_id, None)
                if not self._connections[room]:
                    del self._connections[room]
        logger.info(f"Client {client_id} disconnected. Total: {self.active_count}")

    async def join_room(self, client_id: str, room: str, websocket: WebSocket):
        if room not in self._connections:
            self._connections[room] = {}
        self._connections[room][client_id] = websocket
        self._user_rooms.setdefault(client_id, set()).add(room)

    async def leave_room(self, client_id: str, room: str):
        if room in self._connections:
            self._connections[room].pop(client_id, None)
        if client_id in self._user_rooms:
            self._user_rooms[client_id].discard(room)

    async def broadcast(self, message: dict, room: str = "global"):
        if room not in self._connections:
            return
        disconnected = []
        for client_id, ws in self._connections[room].items():
            try:
                await self._send_to_client(ws, message)
            except Exception:
                disconnected.append(client_id)
        for cid in disconnected:
            await self.disconnect(cid)

    async def send_to_user(self, client_id: str, message: dict):
        for room_conns in self._connections.values():
            if client_id in room_conns:
                await self._send_to_client(room_conns[client_id], message)
                return

    async def _send_to_client(self, websocket: WebSocket, message: dict):
        await websocket.send_json(message)

    @property
    def active_count(self) -> int:
        unique = set()
        for room_conns in self._connections.values():
            unique.update(room_conns.keys())
        return len(unique)

    async def start_redis_listener(self):
        try:
            pubsub = await redis_manager.subscribe(
                "threats", "alerts", "soc_feed", "analytics"
            )
            async for message in pubsub.listen():
                if message["type"] == "message":
                    channel = message["channel"]
                    data = json.loads(message["data"])
                    await self.broadcast(
                        {"type": f"stream:{channel}", "data": data},
                        room=channel,
                    )
                    await self.broadcast(
                        {"type": f"stream:{channel}", "data": data},
                        room="global",
                    )
        except Exception as e:
            logger.error(f"Redis listener error: {e}")


ws_manager = ConnectionManager()
