# Threads Setup (Optional)

## Goal
Enable optional cross-post to Threads (`--platforms ...,threads`).

## Required Values
```env
THREADS_ACCESS_TOKEN=
THREADS_USER_ID=
# Optional for pretty URL:
THREADS_USERNAME=
```

## API Flow Used
1. Create media container:
- `POST /{user-id}/threads` with `media_type=TEXT`, `text`, `access_token`
2. Publish container:
- `POST /{user-id}/threads_publish` with `creation_id`, `access_token`

## Verify
```bash
python3 scripts/publish_sync.py --doctor --platforms threads
```

## Publish Test
```bash
python3 scripts/publish_sync.py \
  --text "CT sync test to threads" \
  --platforms threads
```

## Notes
- This integration is optional; main MVP remains Square + X.
- Threads app review and token lifecycle can affect availability.

## Source References
- Threads docs: `https://developers.facebook.com/docs/threads`
- SDK reference used during implementation: `https://github.com/solojungle/threads-ts`
