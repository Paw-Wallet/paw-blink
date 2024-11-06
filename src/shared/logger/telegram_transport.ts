import axios from 'axios';
import Transport from 'winston-transport';
import configuration from '@/shared/configs/configuration';

function format(msg: string) {
  return msg
    .replace(/\\/g, '\\\\')
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!');
}

export function push(title: string, message: string) {
  if (configuration().app.env !== 'production' && configuration().app.env !== 'development') return;
  title = format(title);
  message = format(message);
  const service = format(configuration().app.name);
  const content = encodeURI(`*${title}*\nService: ${service}\n\`\`\`\n${message}\`\`\``);

  const url = `https://api.telegram.org/bot${configuration().telegram.token}/sendMessage?chat_id=${configuration().telegram.chatId}&text=${content}&parse_mode=MarkdownV2`;
  axios
    .get(url)
    .then(() => {})
    .catch(() => {});
}

export class TelegramTransport extends Transport {
  constructor() {
    super();
  }

  log(info: any, callback: () => void) {
    if (info?.level === 'error') {
      push('Error', info?.message + '\n' + info?.stack?.toString() || '');
    }
    callback();
  }
}
