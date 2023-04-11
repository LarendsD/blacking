import { IsEnum, IsOptional } from 'class-validator';
import { MemberRole } from '../enums/member-role.enum';

export class CreateCommunityMemberDto {
  @IsOptional()
  @IsEnum(MemberRole)
  memberRole: MemberRole;
}
