
import { Controller, Get, NotFoundException, Param } from "@nestjs/common";

import { FindPaymentByIdUseCase } from "src/contexts/payments/application/find-payment-by-id-use-case/find-payment-by-id.use-case";
import { PrimitivePayment } from "src/contexts/payments/domain/payment.entity";
import { PaymentNotFoundException } from "src/contexts/payments/domain/payment-not-found.exception";
import { V1_PAYMENTS } from "../../route.constants";
import { FindPaymentByIdHttpDto } from "./find-payment-by-id.http-dto";

@Controller(V1_PAYMENTS)
export class FindPaymentByIdController {
  constructor(
    private readonly findPaymentByIdUseCase: FindPaymentByIdUseCase,
  ) {}

  @Get(":id")
  async run(
    @Param() params: FindPaymentByIdHttpDto,
  ): Promise<{ payment: PrimitivePayment }> {
    try {
      return await this.findPaymentByIdUseCase.run({
        id: params.id,
      });
    } catch (error) {
      if (error instanceof PaymentNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
