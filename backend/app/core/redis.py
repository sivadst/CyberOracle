import redis.asyncio as aioredis
from app.core.config import settings


class RedisManager:
    def __init__(self):
        self._pool: aioredis.Redis | None = None
        self._pubsub: aioredis.client.PubSub | None = None

    async def connect(self):
        self._pool = aioredis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            max_connections=50,
        )
        await self._pool.ping()

    async def disconnect(self):
        if self._pubsub:
            await self._pubsub.close()
        if self._pool:
            await self._pool.close()

    @property
    def client(self) -> aioredis.Redis:
        if not self._pool:
            raise RuntimeError("Redis not connected")
        return self._pool

    async def publish(self, channel: str, message: str):
        await self.client.publish(channel, message)

    async def subscribe(self, *channels: str) -> aioredis.client.PubSub:
        self._pubsub = self.client.pubsub()
        await self._pubsub.subscribe(*channels)
        return self._pubsub

    async def get(self, key: str) -> str | None:
        return await self.client.get(key)

    async def set(self, key: str, value: str, expire: int = 3600):
        await self.client.set(key, value, ex=expire)

    async def delete(self, key: str):
        await self.client.delete(key)

    async def incr(self, key: str) -> int:
        return await self.client.incr(key)


redis_manager = RedisManager()
