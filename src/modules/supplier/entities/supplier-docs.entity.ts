import { EntityName } from 'src/common/enums/entity-name.enum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SupplierEntity } from './supplier.entity';

@Entity(EntityName.SupplierDocs)
export class SupplierDocsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  supplierId: number;

  @Column()
  acceptedDoc: string;

  @Column()
  image: string;

  @OneToOne(() => SupplierEntity, (sup) => sup.docs, { onDelete: 'CASCADE' })
  supplier: SupplierEntity;
}
