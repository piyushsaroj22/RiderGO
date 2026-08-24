# Cloudinary

## Configuration

`config/cloudinary.ts` configures the Cloudinary client with:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

These values are required by `config/env.ts` and must not be documented with real values.

## Upload and stream handling

`cloudinary.service.ts` accepts an in-memory `Buffer` and a caller-provided folder. It creates a readable stream with `streamifier`, pipes it to `cloudinary.uploader.upload_stream()`, and sets `resource_type: "image"`. The Promise resolves with the Cloudinary `secure_url` and `public_id`; provider errors reject it.

## Delete

`deleteImage(publicId)` returns without calling Cloudinary for an empty public ID. Otherwise it calls `cloudinary.uploader.destroy(publicId)`. The returned Cloudinary result is not inspected or normalized.

## Callers and folders

| Caller        | Asset         | Folder                           |
| ------------- | ------------- | -------------------------------- |
| User module   | Profile image | `ridergo/profile-images`         |
| Driver module | Profile image | `ridergo/drivers/profile-images` |
| Driver module | License image | `ridergo/drivers/license-images` |
| Driver module | RC image      | `ridergo/drivers/rc-images`      |
| Driver module | Vehicle image | `ridergo/drivers/vehicle-images` |

User and Driver models store both the delivered URL and Cloudinary public ID. On replacement, the service deletes the old asset, uploads the new buffer, stores the new URL/public ID, and saves the account.

## Validation and failure boundaries

Multer supplies memory buffering, accepts MIME types beginning with `image/`, and limits files to 5 MB. The source does not verify magic bytes, image contents, dimensions, or decodability.

Deletion and database save are separate from upload. A failed upload after deletion can leave the model pointing at a deleted asset; a failed save after upload can leave an unreferenced Cloudinary asset. Cloudinary errors propagate to the generic application error path; no Cloudinary-specific response contract is confirmed.
