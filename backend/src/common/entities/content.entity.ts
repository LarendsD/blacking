import { Column } from 'typeorm';

export abstract class Content {
  @Column('text', { name: 'text_content', nullable: true })
  textContent: string;

  @Column('text', { name: 'image_content', array: true, nullable: true })
  imageContent: string[];

  @Column('text', { name: 'video_content', array: true, nullable: true })
  videoContent: string[];

  @Column('text', { name: 'music_content', array: true, nullable: true })
  musicContent: string[];

  @Column('text', { name: 'other_content', array: true, nullable: true })
  otherContent: string[];
}
