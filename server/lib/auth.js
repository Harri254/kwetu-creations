import crypto from 'node:crypto';
import { User } from '../models/index.js';
import { formatUser } from './serializers.js';

const PASSWORD_ITERATIONS = 100000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = 'sha512';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? 0 : 4 - (normalized.length % 4);
  const padded = normalized + '='.repeat(padding);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.MONGODB_URI || 'kwetu-dev-secret';
}

function signValue(value) {
  return crypto.createHmac('sha256', getAuthSecret()).update(value).digest('base64url');
}

function createLegacyPasswordHash(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString('hex');
  return `pbkdf2$${PASSWORD_ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash) {
    return false;
  }

  if (storedHash.startsWith('pbkdf2$')) {
    const [, iterationsValue, salt, hash] = storedHash.split('$');
    const iterations = Number(iterationsValue);

    if (!iterations || !salt || !hash) {
      return false;
    }

    const nextHash = crypto
      .pbkdf2Sync(password, salt, iterations, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
      .toString('hex');

    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(nextHash, 'hex'));
  }

  return storedHash === createLegacyPasswordHash(password);
}

export function createAuthToken(user) {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signValue(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);

  if (signature.length !== expectedSignature.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    if (!payload?.sub || !payload?.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getBearerToken(headers) {
  const authorization = headers.authorization || headers.Authorization;

  if (!authorization || typeof authorization !== 'string') {
    return null;
  }

  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

export async function requireAuth(req, res, next) {
  const token = getBearerToken(req.headers);
  const payload = verifyAuthToken(token);

  if (!payload) {
    res.status(401).send({ message: 'Authentication required.' });
    return;
  }

  const user = await User.findById(payload.sub).select('-passwordHash');

  if (!user || !user.isActive) {
    res.status(401).send({ message: 'Your session is no longer valid.' });
    return;
  }

  req.auth = {
    user,
    token,
    payload,
  };

  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth?.user || !roles.includes(req.auth.user.role)) {
      res.status(403).send({ message: 'You do not have permission to perform this action.' });
      return;
    }

    next();
  };
}

export function formatAuthResponse(user) {
  return {
    token: createAuthToken(user),
    user: formatUser(user),
  };
}
