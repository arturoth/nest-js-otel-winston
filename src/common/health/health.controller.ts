import { Controller, Get, Header } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @Header('Cache-Control', 'none')
  check() {
    const PORT =
      process.env.APP_PORT && Number.isInteger(+process.env.APP_PORT)
        ? +process.env.APP_PORT
        : 8080;
    return this.health.check([
      () => this.http.pingCheck('app', `http://localhost:${PORT}/health/ping`),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
    ]);
  }

  @Get('ping')
  ping() {
    return 'ok';
  }
}
