import jwt from 'jsonwebtoken'
const { MUX_SIGNING_KEY_ID, MUX_SIGNING_KEY_SECRET } = process.env

if (typeof MUX_SIGNING_KEY_ID !== "string") {
  throw new Error("Missing env: MUX_SIGNING_KEY_ID")
}

if (typeof MUX_SIGNING_KEY_SECRET !== "string") {
  throw new Error("Missing env: MUX_SIGNING_KEY_SECRET")
}

export function generateMuxVideoToken(playbackId: string | null) {
  if (playbackId) {
    const secretKey = Buffer.from(MUX_SIGNING_KEY_SECRET as string, 'base64').toString("ascii")
    const token = jwt.sign(
      {
        sub: playbackId,
        aud: "v",
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        kid: MUX_SIGNING_KEY_ID,
      },
      secretKey,
      { algorithm: "RS256" }, 
    )
    return token
  } else {
    return undefined
  }
}

export function generateMuxThumbnailToken(playbackId: string | null, fit: string | undefined = "crop", defaultHeight: string = "770") {
  if (playbackId) {
    const secretKey = Buffer.from(MUX_SIGNING_KEY_SECRET as string, 'base64').toString("ascii")
    const token = jwt.sign(
      {
        sub: playbackId,
        aud: "t",
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        kid: MUX_SIGNING_KEY_ID,
        height: defaultHeight,
        fit_mode: fit
      },
      secretKey,
      { algorithm: "RS256" }, 
    )
    return token
  } else {
    return undefined
  }
}

export function generateMuxGifToken(playbackId: string | null, defaultHeight: string = "640") {
  if (playbackId) {
    const secretKey = Buffer.from(MUX_SIGNING_KEY_SECRET as string, 'base64').toString("ascii")
    const token = jwt.sign(
      {
        sub: playbackId,
        aud: "g",
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        kid: MUX_SIGNING_KEY_ID,
        height: defaultHeight,
      },
      secretKey,
      { algorithm: "RS256" }, 
    )
    return token
  } else {
    return undefined
  }
}