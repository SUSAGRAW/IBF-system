import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notification_info')
export class NotificationInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  public notificationInfoId: string;

  @Column()
  public logo: string;

  @Column()
  public triggerStatement: string;

  @Column({ nullable: true })
  public linkSocialMediaType: string;

  @Column({ nullable: true })
  public linkSocialMediaUrl: string;
}
