import redis
from constants import REDIS_HOST, REDIS_PORT

class RedisWrapper:
    def __init__(self):
        self.redis = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

    def get(self, key):
        return self.redis.get(key)
    
    def set(self, key, value, expiry=30*60, nx=False, xx=False):
        return self.redis.set(key, value, ex=expiry, nx=nx, xx=xx)
    
    def delete(self, key):
        return self.redis.delete(key)
    