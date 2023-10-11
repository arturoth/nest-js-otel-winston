import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

import * as winston from 'winston';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
// https://www.npmjs.com/package/@opentelemetry/instrumentation-winston
// https://opentelemetry.io/docs/faas/lambda-auto-instrument/

class Tracer {
  private sdk: NodeSDK | null = null;
  private entity: string =
    process.env.OTEL_ENTITY_NAME || 'nest-js-otel-winston-local';
  private nral: string = process.env.NEW_RELIC_LICENSE_KEY;

  private exporter = new OTLPTraceExporter({
    url: `${process.env.OTLP_COLLECTOR}/v1/traces`, // https://otlp.nr-data.net:4318 HTTP
    headers: {
      'api-key': process.env.NEW_RELIC_LICENSE_KEY || this.nral, // Your license key from NewRelic account
    },
  });

  private metricsExporter = new OTLPMetricExporter({
    url: `${process.env.OTLP_COLLECTOR}/v1/metrics`,
    headers: {
      'api-key': process.env.NEW_RELIC_LICENSE_KEY || this.nral, // Your license key from NewRelic account
    },
  });

  private metricReader = new PeriodicExportingMetricReader({
    exporter: this.metricsExporter,
    exportIntervalMillis: 10000,
  });

  private provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: this.entity,
    }),
  });

  public init() {
    try {
      // export spans to console (useful for debugging)
      this.provider.addSpanProcessor(
        new SimpleSpanProcessor(new ConsoleSpanExporter()),
      );

      // export spans to opentelemetry collector
      this.provider.addSpanProcessor(new SimpleSpanProcessor(this.exporter));
      this.provider.register();

      this.sdk = new NodeSDK({
        traceExporter: this.exporter,
        metricReader: this.metricReader,
        instrumentations: [
          getNodeAutoInstrumentations({
            // Lets disable fs for now, otherwise we cannot see the traces we want,
            // You can disable or enable instrumentation as needed
            '@opentelemetry/instrumentation-fs': { enabled: false },
          }),
          new GrpcInstrumentation(),
          new WinstonInstrumentation({
            enabled: true,
            logHook: (span, record) => {
              record['resource.service.name'] =
                this.provider.resource.attributes['service.name'];
            },
          }),
        ],
      });

      this.sdk.start();

      console.info('The tracer has been initialized');
    } catch (e) {
      console.error('Failed to initialize the tracer', e);
    }
  }
}

export default new Tracer();
