import { Body, Controller, Post } from "@nestjs/common";

import { CreatePaymentUseCase } from "src/contexts/payments/application/create-payment-use-case/create-payment.use-case";
import { PrimitivePayment } from "src/contexts/payments/domain/payment.entity";
import { V1_PAYMENTS } from "../../route.constants";
import { CreatePaymentHttpDTO } from "./create-payment.http-dto";

@Controller(V1_PAYMENTS)
export class CreatePaymentController {
  constructor(private readonly createPaymentUseCase: CreatePaymentUseCase) {}

  @Post()
  async run(
    @Body() createPaymentHttpDto: CreatePaymentHttpDTO,
  ): Promise<{ payment: PrimitivePayment }> {
    return await this.createPaymentUseCase.run({
      amount: createPaymentHttpDto.amount,
      customerId: createPaymentHttpDto.customerId,
    });
  }
}