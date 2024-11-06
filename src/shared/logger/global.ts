import * as winston from 'winston';
import { createLogger, transports } from 'winston';
import { utilities } from 'nest-winston';

import LokiTransport from 'winston-loki';
import configuration from '@/shared/configs/configuration';
import { TelegramTransport } from '@/shared/logger/telegram_transport';
import { mask } from '@/shared/logger/mask';

export const instance = createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new transports.Console({
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.prettyPrint(),
        winston.format.timestamp(),
        winston.format((info) => mask(info))(),
        utilities.format.nestLike(configuration().app.name, {
          colors: true,
          prettyPrint: true,
        }),
      ),
      handleExceptions: true,
    }),
    new LokiTransport({
      host: configuration().loki.host,
      labels: { app: configuration().app.name },
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.prettyPrint(),
        winston.format.timestamp(),
        utilities.format.nestLike(configuration().app.name, {
          colors: true,
          prettyPrint: true,
        }),
      ),
      replaceTimestamp: false,
    }),
    new TelegramTransport(),
  ],
  exitOnError: false,
});
