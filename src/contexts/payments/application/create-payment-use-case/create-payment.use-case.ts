import { PaymentRepository } from "../../domain/ payment.repository";
import { Payment, PrimitivePayment } from "../../domain/payment.entity";
import { CreatePaymentDto } from "./create-payment.dto";
import { Injectable } from "src/contexts/shared/dependency-inyection/injectable";

@Injectable()
export class CreatePaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async run(dto: CreatePaymentDto): Promise<{ payment: PrimitivePayment }> {
    const payment = Payment.create(dto);

    await this.paymentRepository.save(payment);

    return {
      payment: payment.toPrimitives(),
    };
  }
}