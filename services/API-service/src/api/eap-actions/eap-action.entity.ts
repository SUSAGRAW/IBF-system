import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CountryEntity } from '../country/country.entity';
import { AreaOfFocusEntity } from './area-of-focus.entity';
import { EapActionStatusEntity } from './eap-action-status.entity';

@Entity('eap-action')
export class EapActionEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public action: string;

  @Column()
  public label: string;

  @ManyToOne((): typeof CountryEntity => CountryEntity)
  @JoinColumn({
    name: 'countryCodeISO3',
    referencedColumnName: 'countryCodeISO3',
  })
  public countryCodeISO3: string;

  @ManyToOne(
    (): typeof AreaOfFocusEntity => AreaOfFocusEntity,
    (aof): EapActionEntity[] => aof.actions,
  )
  public areaOfFocus: AreaOfFocusEntity;

  @OneToMany(
    (): typeof EapActionStatusEntity => EapActionStatusEntity,
    (i): EapActionEntity => i.actionChecked,
  )
  public checked: EapActionStatusEntity[];
}
