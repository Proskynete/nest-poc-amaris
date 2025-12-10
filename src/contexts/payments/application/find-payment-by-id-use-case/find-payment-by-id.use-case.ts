import { Injectable } from "src/contexts/shared/dependency-inyection/injectable";
import { PaymentRepository } from "../../domain/ payment.repository";
import { FindPaymentByIdDto } from "./find-payment-by-id.dto";
import { PrimitivePayment } from "../../domain/payment.entity";
import { PaymentNotFoundException } from "../../domain/payment-not-found.exception";

@Injectable()
export class FindPaymentByIdUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async run(
    findPaymentByIdDto: FindPaymentByIdDto,
  ): Promise<{ payment: PrimitivePayment }> {
    const payment = await this.paymentRepository.findById(
      findPaymentByIdDto.id,
    );

    if (!payment) {
      throw new PaymentNotFoundException(findPaymentByIdDto.id);
    }

    return {
      payment: payment.toPrimitives(),
    };
  }
}