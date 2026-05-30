import json
import logging
from datetime import datetime, timezone
from fastapi import WebSocket, WebSocketDisconnect
from app.websocket.manager import ws_manager

logger = logging.getLogger(__name__)

VALID_ACTIONS = {
    "subscribe", "unsubscribe", "ping", "get_stats",
}


async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await ws_manager.connect(websocket, client_id)
    try:
        while True:
            raw = await websocket.receive_text()
            try:
                message = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "message": "Invalid JSON"})
                continue

            action = message.get("action")

            if action == "ping":
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                })

            elif action == "subscribe":
                room = message.get("room", "global")
                await ws_manager.join_room(client_id, room, websocket)
                await websocket.send_json({
                    "type": "subscribed",
                    "room": room,
                })

            elif action == "unsubscribe":
                room = message.get("room", "global")
                await ws_manager.leave_room(client_id, room)
                await websocket.send_json({
                    "type": "unsubscribed",
                    "room": room,
                })

            elif action == "get_stats":
                await websocket.send_json({
                    "type": "stats",
                    "active_connections": ws_manager.active_count,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                })

            else:
                await websocket.send_json({
                    "type": "error",
                    "message": f"Unknown action: {action}",
                })

    except WebSocketDisconnect:
        await ws_manager.disconnect(client_id)
    except Exception as e:
        logger.error(f"WebSocket error for {client_id}: {e}")
        await ws_manager.disconnect(client_id)
