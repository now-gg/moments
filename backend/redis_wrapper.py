import redis
import logging
from constants import REDIS_HOST, REDIS_PORT
class RedisWrapper:
    def __init__(self):
        try:
            self.redis = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        except Exception as e:
            logging.error(e)

    def get(self, key):
        try:
            return self.redis.get(key)
        except Exception as e:
            logging.error(e)
            return None
    
    def set(self, key, value, expiry=30*60, nx=False, xx=False):
        try:
            return self.redis.set(key, value, ex=expiry, nx=nx, xx=xx)
        except Exception as e:
            logging.error(e)
            return None
    
    def delete(self, key):
        try:
            return self.redis.delete(key)
        except Exception as e:
            logging.error(e)
            return None
    