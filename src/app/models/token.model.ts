import {UserrolEnum} from "@core/utils/userrol.enum";


export interface Token {
  company?: string;
  fullname?: string;
  rol?: UserrolEnum;
  company_type?: string;
  exp?: number;
  user_id?: string;
  fullToken?: string;
  username?: string;
}
