import { Message } from '../../src/messages/entities/message.entity';
import { User } from '../../src/users/entities/user.entity';
import { Repository } from 'typeorm';

export const prepareMessages = async (
  repo: Repository<Message>,
  userData: User[],
  messageData: Array<Record<string, unknown>>,
): Promise<Message[]> => {
  return repo.save([
    {
      senderId: userData[0].id,
      addresseeId: userData[1].id,
      ...messageData[0],
    },
    {
      senderId: userData[0].id,
      addresseeId: userData[2].id,
      ...messageData[1],
    },
    {
      senderId: userData[1].id,
      addresseeId: userData[2].id,
      ...messageData[2],
    },
    {
      senderId: userData[2].id,
      addresseeId: userData[0].id,
      ...messageData[3],
    },
  ]);
};
