import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityName } from 'src/common/enums/entity-name.enum';
import { SupplierEntity } from './supplier.entity';

@Entity(EntityName.SupplierOTP)
export class SupplierOTPEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  code: string;
  @Column()
  expires_in: Date;
  @Column()
  supplierId: number;
  @OneToOne(() => SupplierEntity, (sup) => sup.otp, { onDelete: 'CASCADE' })
  supplier: SupplierEntity;
}
