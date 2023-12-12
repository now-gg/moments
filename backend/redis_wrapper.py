import redis

class RedisWrapper:
    def __init__(self):
        self.redis = redis.Redis(host='10.216.98.51', port=6379, decode_responses=True)

    def get(self, key):
        return self.redis.get(key)
    
    def set(self, key, value, expiry=30*60, nx=False, xx=False):
        return self.redis.set(key, value, ex=expiry, nx=nx, xx=xx)
    
    def delete(self, key):
        return self.redis.delete(key)
    