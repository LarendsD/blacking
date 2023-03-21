import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(userId: number, createMessageDto: CreateMessageDto) {
    const messageEntity = new Message();
    messageEntity.senderId = userId;

    const message = this.messagesRepository.merge(
      messageEntity,
      createMessageDto,
    );

    return this.messagesRepository.save(message);
  }

  async findAllOfLoggedUser(userId: number) {
    return this.messagesRepository.find({
      where: [{ senderId: userId }, { addresseeId: userId }],
      relations: { addressee: true, sender: true },
    });
  }

  async findOne(id: number) {
    return this.messagesRepository.findOne({
      where: { id },
      relations: { addressee: true, sender: true },
    });
  }

  async update(id: number, userId: number, updateMessageDto: UpdateMessageDto) {
    await this.messagesRepository.update(
      { senderId: userId, id },
      updateMessageDto,
    );

    return this.messagesRepository.findOne({ where: { id } });
  }

  async delete(id: number, userId: number) {
    return this.messagesRepository.delete({ id, senderId: userId });
  }
}
