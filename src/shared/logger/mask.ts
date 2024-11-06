import { isString } from '@nestjs/common/utils/shared.utils';

const sensitiveKeys = [
  /cookie/i,
  /passw(or)?d/i,
  /^pw$/,
  /^pass$/i,
  /secret/i,
  /token/i,
  /api[-._]?key/i,
  /[\w-]+\.[\w-]+\.[\w-]+$/i, // jwt token
  /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/i, // phone number
  /(84|0[3|5789])+([0-9]{8})\b/i, // phone number 2
  /[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i, // email
];

export function mask(info: any) {
  sensitiveKeys.forEach((key) => {
    if (info.message && isString(info.message) && info.message.match(key)) {
      info.message = info.message.replace(key, '***');
    }
    if (info.stack && isString(info.stack) && info.stack.match(key)) {
      info.stack = info.stack.replace(key, '***');
    }
  });
  return info;
}
