import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { EcosystemService } from './ecosystem/ecosystem.service';

/**
 * One-shot CLI: drains all historical event senders for every project's
 * (latestPackageAddress × module) and writes them into the project-senders
 * collection. Resumable — re-running picks up from the last saved cursor.
 *
 * Usage (in container):
 *   docker exec iota-trade-scanner-api node dist/backfill-senders.js
 */
async function main() {
  const logger = new Logger('BackfillSenders');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    const service = app.get(EcosystemService);
    logger.log('Starting sender backfill across all L1 projects in the latest snapshot...');
    const start = Date.now();

    const result = await service.backfillAllSenders((info) => {
      logger.log(`  ${info.project} :: ${info.module} → ${info.senders} unique senders`);
    });

    const seconds = ((Date.now() - start) / 1000).toFixed(1);
    logger.log(
      `Backfill complete in ${seconds}s — ${result.totalProjects} projects, ${result.totalModules} modules, ${result.totalSenders} total senders accumulated.`,
    );
  } catch (e) {
    new Logger('BackfillSenders').error('Backfill failed', e);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

main();
