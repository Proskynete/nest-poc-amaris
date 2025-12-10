import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreatePaymentHttpDTO {
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsUUID()
  @IsNotEmpty()
  customerId!: string;
}