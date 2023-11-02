# Moments backend

### plan

- video POST on our server, request provides video data and token
- upload to cloudflare
- send __/api/vid/v1/createVideo__ call for new videoid with all the metadata info
- send __/api/vid/v1/updateVideo__ for previous videoid with state: 'Deleted' 
(need to confirm with Amit if this is enough to delete video from cloudflare ?)
- delete previous video (by sending DELETE call to cloudflare api)

### things required

- cloudflare account identifier
- cloudflare api token
- header auth token for nowgg api calls