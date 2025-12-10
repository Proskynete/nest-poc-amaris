import { Module } from "@nestjs/common";

import { CreatePaymentUseCase } from "../application/create-payment-use-case/create-payment.use-case";
import { FindPaymentByIdUseCase } from "../application/find-payment-by-id-use-case/find-payment-by-id.use-case";
import { PaymentRepository } from "../domain/ payment.repository";
import { CreatePaymentController } from "./http-api/v1/create-payment/create-payment.controller";
import { InMemoryPaymentRepository } from "./repositories/in-memory-payment.repository";
import { FindPaymentByIdController } from "./http-api/v1/find-payment-by-id/find-payment-by-id.controller";

@Module({
  controllers: [CreatePaymentController, FindPaymentByIdController],
  providers: [
    CreatePaymentUseCase,
    FindPaymentByIdUseCase,
    InMemoryPaymentRepository,
    {
      provide: PaymentRepository,
      useExisting: InMemoryPaymentRepository,
    },
  ],
  exports: [CreatePaymentUseCase, FindPaymentByIdUseCase],
})
export class PaymentModule {}