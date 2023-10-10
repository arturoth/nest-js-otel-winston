import { Injectable } from '@nestjs/common';
import { trace } from '@opentelemetry/api';
import * as winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getSlow(): Promise<string> {
    const span = trace.getTracer('nest-tracer').startSpan('root-slow-span');
    span.setAttributes({
      'http.method': 'GET',
      'http.url': '/slow',
      'trace.id': span.spanContext().traceId,
    });

    logger.info('Span:', 'root-slow-span', 'TraceId:', span.spanContext().traceId);
    if ((Math.floor(Math.random() * 100)) === 0) {
      throw new Error('Internal Error')
    }
    // Generate number between 3-6, then delay by a factor of 1000 (miliseconds)
    const delaySeconds = Math.floor(Math.random() * (6 - 3)) + 3
    await new Promise(res => setTimeout(res, delaySeconds * 1000))
    span.end();
    return "Slow url accessed!";
  }

}
